import type { IncidentId, IncidentQuery } from '../domain/incident';
import {
  createEmptyIncidentEntityState,
  type IncidentEntityState,
} from './incident-entity-state';

export type IncidentLoadStatus = 'idle' | 'loading' | 'loaded' | 'error';
export type IncidentLoadSource = 'network' | 'cache';

export interface IncidentStoreState {
  readonly collection: IncidentEntityState;
  readonly query: IncidentQuery;
  readonly selectedIncidentId: IncidentId | null;
  readonly loadStatus: IncidentLoadStatus;
  readonly errorMessage: string | null;
  readonly lastLoadedAt: number | null;
  readonly loadSource: IncidentLoadSource | null;
  readonly pendingAcknowledgementId: IncidentId | null;
  readonly pendingResponseStartId: IncidentId | null;
}

export function createInitialIncidentStoreState(): IncidentStoreState {
  return {
    collection: createEmptyIncidentEntityState(),
    query: {
      searchTerm: '',
      severity: 'All',
    },
    selectedIncidentId: null,
    loadStatus: 'idle',
    errorMessage: null,
    lastLoadedAt: null,
    loadSource: null,
    pendingAcknowledgementId: null,
    pendingResponseStartId: null,
  };
}

export function reconcileSelectedIncidentId(
  collection: IncidentEntityState,
  previousSelection: IncidentId | null,
): IncidentId | null {
  if (previousSelection && collection.entities[previousSelection]) {
    return previousSelection;
  }

  return collection.ids[0] ?? null;
}
