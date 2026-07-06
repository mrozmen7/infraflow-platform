import type { Incident } from '../domain/incident';
import { normalizeIncidents } from './incident-entity-state';
import {
  createInitialIncidentStoreState,
  reconcileSelectedIncidentId,
} from './incident-store-state';

const incidents: readonly Incident[] = [
  {
    id: 'INC-STATE-001',
    title: 'Ventilation alarm',
    description: 'Ventilation alarm detected in North Tunnel.',
    location: 'North Tunnel',
    assetId: 'FAN-NT-001',
    reportedAt: '2026-07-04T08:00:00.000Z',
    severity: 'Medium',
    priority: 'P2',
    status: 'Open',
    operationalSignals: ['Airflow below threshold'],
  },
  {
    id: 'INC-STATE-002',
    title: 'Emergency light unavailable',
    description: 'An emergency lighting segment is offline.',
    location: 'South Tunnel',
    assetId: 'LIGHT-ST-010',
    reportedAt: '2026-07-04T08:05:00.000Z',
    severity: 'High',
    priority: 'P1',
    status: 'Open',
    operationalSignals: ['Lighting circuit offline'],
  },
];

describe('IncidentStoreState', () => {
  it('creates a fresh and predictable initial state', () => {
    const firstState = createInitialIncidentStoreState();
    const secondState = createInitialIncidentStoreState();

    expect(firstState).toEqual({
      collection: { ids: [], entities: {} },
      query: { searchTerm: '', severity: 'All' },
      selectedIncidentId: null,
      loadStatus: 'idle',
      errorMessage: null,
      lastLoadedAt: null,
      loadSource: null,
      pendingAcknowledgementId: null,
    });
    expect(firstState).not.toBe(secondState);
    expect(firstState.collection).not.toBe(secondState.collection);
  });

  it('keeps the previous selection while that incident still exists', () => {
    const collection = normalizeIncidents(incidents);

    expect(reconcileSelectedIncidentId(collection, 'INC-STATE-002')).toBe(
      'INC-STATE-002',
    );
  });

  it('falls back to the first incident or null when selection becomes invalid', () => {
    const collection = normalizeIncidents(incidents);

    expect(reconcileSelectedIncidentId(collection, 'INC-MISSING')).toBe('INC-STATE-001');
    expect(reconcileSelectedIncidentId(collection, null)).toBe('INC-STATE-001');
    expect(
      reconcileSelectedIncidentId(
        { ids: [], entities: {} },
        'INC-STATE-001',
      ),
    ).toBeNull();
  });
});
