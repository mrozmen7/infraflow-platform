import {
  Component,
  computed,
  effect,
  inject,
  linkedSignal,
  resource,
  signal,
  viewChild,
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged } from 'rxjs';

import { EmptyState } from '../../../../shared/ui/empty-state/empty-state';
import {
  acknowledgeIncident as acknowledgeIncidentUseCase,
  IncidentRepositoryPort,
  searchIncidents,
} from '../../application';
import { Incident, IncidentQuery, IncidentSeverityFilter } from '../../domain/incident';
import { IncidentFilterBar } from '../../ui/incident-filter-bar/incident-filter-bar';
import { IncidentList } from '../../ui/incident-list/incident-list';

@Component({
  selector: 'app-incident-list-page',
  imports: [EmptyState, IncidentFilterBar, IncidentList],
  templateUrl: './incident-list-page.html',
  styleUrl: './incident-list-page.scss',
})
export class IncidentListPage {
  private readonly incidentRepository = inject(IncidentRepositoryPort);
  private readonly title = inject(Title);
  private readonly filterBar = viewChild(IncidentFilterBar);

  protected readonly searchTerm = signal('');
  protected readonly severityFilter = signal<IncidentSeverityFilter>('All');
  protected readonly actionMessage = signal('');

  private readonly debouncedSearchTerm = toSignal(
    toObservable(this.searchTerm).pipe(debounceTime(250), distinctUntilChanged()),
    { initialValue: '' },
  );

  private readonly incidentQuery = computed<IncidentQuery>(() => ({
    searchTerm: this.debouncedSearchTerm().trim(),
    severity: this.severityFilter(),
  }));

  protected readonly incidentsResource = resource({
    params: () => this.incidentQuery(),
    loader: ({ params, abortSignal }) =>
      searchIncidents(this.incidentRepository, params, abortSignal),
  });

  protected readonly incidents = computed<readonly Incident[]>(() =>
    this.incidentsResource.hasValue() ? this.incidentsResource.value() : [],
  );

  protected readonly selectedIncidentId = linkedSignal<readonly Incident[], string | null>({
    source: this.incidents,
    computation: (incidents, previous) => {
      const previousSelection = previous?.value;

      return incidents.some((incident) => incident.id === previousSelection)
        ? (previousSelection ?? null)
        : (incidents[0]?.id ?? null);
    },
  });

  protected readonly resultSummary = computed(() => {
    const incidentCount = this.incidents().length;
    return `${incidentCount} incident${incidentCount === 1 ? '' : 's'} found`;
  });

  protected readonly errorMessage = computed(() =>
    this.incidentsResource.error() ? 'Incident data could not be loaded. Retry the request.' : '',
  );

  private readonly updateDocumentTitle = effect(() => {
    if (!this.incidentsResource.isLoading() && !this.incidentsResource.error()) {
      this.title.setTitle(`${this.resultSummary()} · InfraFlow`);
    }
  });

  protected updateSearchTerm(searchTerm: string): void {
    this.searchTerm.set(searchTerm);
    this.actionMessage.set('');
  }

  protected updateSeverity(severity: IncidentSeverityFilter): void {
    this.severityFilter.set(severity);
    this.actionMessage.set('');
  }

  protected resetFilters(): void {
    this.searchTerm.set('');
    this.severityFilter.set('All');
    this.actionMessage.set('Filters reset.');
    this.filterBar()?.focusSearch();
  }

  protected selectIncident(incidentId: string): void {
    this.selectedIncidentId.set(incidentId);
    this.actionMessage.set(`${incidentId} selected for operational review.`);
  }

  protected async acknowledgeIncident(incidentId: string): Promise<void> {
    this.actionMessage.set(`Acknowledging ${incidentId}…`);

    try {
      await acknowledgeIncidentUseCase(this.incidentRepository, incidentId);
      this.actionMessage.set(`${incidentId} acknowledged by the operator.`);
      this.incidentsResource.reload();
    } catch {
      this.actionMessage.set(`${incidentId} could not be acknowledged.`);
    }
  }

  protected retryLoading(): void {
    this.actionMessage.set('Retrying incident request…');
    this.incidentsResource.reload();
  }
}
