import { computed, effect, inject, Injectable, resource, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged } from 'rxjs';

import {
  acknowledgeIncident as acknowledgeIncidentUseCase,
  createIncident as createIncidentUseCase,
  IncidentNotFoundError,
  IncidentRepositoryPort,
  searchIncidents,
} from '../application';
import {
  acknowledgeIncident as applyAcknowledgement,
  type Incident,
  type IncidentId,
  type IncidentQuery,
  type IncidentSeverityFilter,
  type NewIncident,
  parseIncidentId,
} from '../domain/incident';
import {
  normalizeIncidents,
  selectAllIncidents,
  upsertIncident,
} from './incident-entity-state';
import {
  createInitialIncidentStoreState,
  type IncidentStoreState,
  reconcileSelectedIncidentId,
} from './incident-store-state';

const INCIDENT_CACHE_TTL_MS = 30_000;

interface IncidentCacheEntry {
  readonly incidents: readonly Incident[];
  readonly loadedAt: number;
}

interface IncidentLoadResult extends IncidentCacheEntry {
  readonly source: 'network' | 'cache';
}

export class IncidentAcknowledgementInProgressError extends Error {
  constructor(readonly pendingIncidentId: IncidentId) {
    super(`Incident "${pendingIncidentId}" is already being acknowledged.`);
    this.name = 'IncidentAcknowledgementInProgressError';
  }
}

@Injectable()
export class IncidentStore {
  private readonly repository = inject(IncidentRepositoryPort);
  private readonly state = signal<IncidentStoreState>(createInitialIncidentStoreState());
  private readonly incidentCache = new Map<string, IncidentCacheEntry>();

  readonly searchTerm = computed(() => this.state().query.searchTerm);
  readonly severityFilter = computed(() => this.state().query.severity);
  readonly incidents = computed(() => selectAllIncidents(this.state().collection));
  readonly selectedIncidentId = computed(() => this.state().selectedIncidentId);
  readonly loadStatus = computed(() => this.state().loadStatus);
  readonly isLoading = computed(() => this.loadStatus() === 'loading');
  readonly errorMessage = computed(() => this.state().errorMessage);
  readonly lastLoadedAt = computed(() => this.state().lastLoadedAt);
  readonly loadSource = computed(() => this.state().loadSource);
  readonly pendingAcknowledgementId = computed(
    () => this.state().pendingAcknowledgementId,
  );
  readonly resultSummary = computed(() => {
    const incidentCount = this.incidents().length;
    return `${incidentCount} incident${incidentCount === 1 ? '' : 's'} found`;
  });

  private readonly debouncedSearchTerm = toSignal(
    toObservable(this.searchTerm).pipe(debounceTime(250), distinctUntilChanged()),
    { initialValue: '' },
  );

  private readonly requestQuery = computed<IncidentQuery>(() => ({
    searchTerm: this.debouncedSearchTerm().trim(),
    severity: this.severityFilter(),
  }));

  private readonly incidentsResource = resource({
    params: () => this.requestQuery(),
    loader: ({ params, abortSignal }) => this.loadIncidents(params, abortSignal),
  });

  private readonly synchronizeResourceState = effect(() => {
    if (this.incidentsResource.isLoading()) {
      this.patchState({ loadStatus: 'loading', errorMessage: null });
      return;
    }

    if (this.incidentsResource.error()) {
      this.patchState({
        loadStatus: 'error',
        errorMessage: 'Incident data could not be loaded. Retry the request.',
      });
      return;
    }

    if (this.incidentsResource.hasValue()) {
      const result = this.incidentsResource.value();
      const collection = normalizeIncidents(result.incidents);

      this.state.update((state) => ({
        ...state,
        collection,
        selectedIncidentId: reconcileSelectedIncidentId(
          collection,
          state.selectedIncidentId,
        ),
        loadStatus: 'loaded',
        errorMessage: null,
        lastLoadedAt: result.loadedAt,
        loadSource: result.source,
      }));
    }
  });

  setSearchTerm(searchTerm: string): void {
    this.updateQuery({ searchTerm });
  }

  setSeverityFilter(severity: IncidentSeverityFilter): void {
    this.updateQuery({ severity });
  }

  resetFilters(): void {
    this.patchState({
      query: {
        searchTerm: '',
        severity: 'All',
      },
    });
  }

  selectIncident(rawIncidentId: string): void {
    const incidentId = parseIncidentId(rawIncidentId);

    if (this.state().collection.entities[incidentId]) {
      this.patchState({ selectedIncidentId: incidentId });
    }
  }

  async acknowledge(rawIncidentId: string): Promise<void> {
    const incidentId = parseIncidentId(rawIncidentId);
    const currentState = this.state();
    const currentIncident = currentState.collection.entities[incidentId];

    if (!currentIncident) {
      throw new IncidentNotFoundError(incidentId);
    }

    if (currentState.pendingAcknowledgementId) {
      throw new IncidentAcknowledgementInProgressError(
        currentState.pendingAcknowledgementId,
      );
    }

    const optimisticIncident = applyAcknowledgement(currentIncident);

    this.patchState({
      collection: upsertIncident(currentState.collection, optimisticIncident),
      pendingAcknowledgementId: incidentId,
    });

    try {
      const savedIncident = await acknowledgeIncidentUseCase(
        this.repository,
        incidentId,
      );

      this.state.update((state) => ({
        ...state,
        collection: upsertIncident(state.collection, savedIncident),
        pendingAcknowledgementId: null,
      }));
      this.incidentCache.clear();
    } catch (error: unknown) {
      this.state.update((state) => ({
        ...state,
        collection: upsertIncident(state.collection, currentIncident),
        pendingAcknowledgementId: null,
      }));
      throw error;
    }
  }

  async createIncident(newIncident: NewIncident): Promise<Incident> {
    const createdIncident = await createIncidentUseCase(this.repository, newIncident);

    this.incidentCache.clear();
    this.state.update((state) => ({
      ...state,
      collection: upsertIncident(state.collection, createdIncident),
      selectedIncidentId: createdIncident.id,
    }));

    return createdIncident;
  }

  reload(): void {
    this.incidentCache.delete(this.createCacheKey(this.requestQuery()));
    this.incidentsResource.reload();
  }

  private async loadIncidents(
    query: IncidentQuery,
    abortSignal: AbortSignal,
  ): Promise<IncidentLoadResult> {
    const cacheKey = this.createCacheKey(query);
    const cachedResult = this.incidentCache.get(cacheKey);

    if (cachedResult && Date.now() - cachedResult.loadedAt < INCIDENT_CACHE_TTL_MS) {
      return {
        ...cachedResult,
        source: 'cache',
      };
    }

    const incidents = await searchIncidents(this.repository, query, abortSignal);
    const networkResult: IncidentCacheEntry = {
      incidents,
      loadedAt: Date.now(),
    };

    this.incidentCache.set(cacheKey, networkResult);

    return {
      ...networkResult,
      source: 'network',
    };
  }

  private createCacheKey(query: IncidentQuery): string {
    return `${query.searchTerm.toLocaleLowerCase()}::${query.severity}`;
  }

  private updateQuery(queryPatch: Partial<IncidentQuery>): void {
    this.state.update((state) => ({
      ...state,
      query: {
        ...state.query,
        ...queryPatch,
      },
    }));
  }

  private patchState(statePatch: Partial<IncidentStoreState>): void {
    this.state.update((state) => ({ ...state, ...statePatch }));
  }
}
