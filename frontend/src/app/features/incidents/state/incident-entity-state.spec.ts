import type { Incident } from '../domain/incident';
import {
  createEmptyIncidentEntityState,
  normalizeIncidents,
  selectAllIncidents,
  selectIncidentById,
  upsertIncident,
} from './incident-entity-state';

const northTunnelIncident: Incident = {
  id: 'INC-NORTH-001',
  title: 'North Tunnel ventilation stopped',
  description: 'The ventilation unit no longer reports airflow.',
  location: 'North Tunnel',
  assetId: 'TRF-NT-003',
  reportedAt: '2026-07-04T08:00:00.000Z',
  severity: 'Medium',
  priority: 'P2',
  status: 'Open',
  operationalSignals: ['Airflow unavailable'],
};

const transformerIncident: Incident = {
  ...northTunnelIncident,
  id: 'INC-NORTH-002',
  title: 'Transformer temperature rising',
  assetId: 'TRF-NT-004',
  severity: 'High',
  priority: 'P1',
};

describe('IncidentEntityState', () => {
  it('normalizes incidents by id while preserving the first-seen order', () => {
    const duplicateWithNewData: Incident = {
      ...northTunnelIncident,
      title: 'North Tunnel ventilation confirmed offline',
    };
    const source = [northTunnelIncident, transformerIncident, duplicateWithNewData] as const;

    const state = normalizeIncidents(source);

    expect(state.ids).toEqual(['INC-NORTH-001', 'INC-NORTH-002']);
    expect(state.entities['INC-NORTH-001']).toEqual(duplicateWithNewData);
    expect(source).toHaveLength(3);
  });

  it('upserts an existing incident without duplicating its id', () => {
    const state = normalizeIncidents([northTunnelIncident, transformerIncident]);
    const acknowledgedIncident: Incident = {
      ...northTunnelIncident,
      status: 'Acknowledged',
    };

    const updatedState = upsertIncident(state, acknowledgedIncident);

    expect(updatedState.ids).toEqual(state.ids);
    expect(updatedState.entities['INC-NORTH-001']?.status).toBe('Acknowledged');
    expect(state.entities['INC-NORTH-001']?.status).toBe('Open');
  });

  it('appends a new incident and exposes collection selectors', () => {
    const emptyState = createEmptyIncidentEntityState();
    const firstState = upsertIncident(emptyState, northTunnelIncident);
    const finalState = upsertIncident(firstState, transformerIncident);

    expect(selectAllIncidents(finalState)).toEqual([
      northTunnelIncident,
      transformerIncident,
    ]);
    expect(selectIncidentById(finalState, 'INC-NORTH-002')).toEqual(transformerIncident);
    expect(selectIncidentById(finalState, 'INC-MISSING')).toBeUndefined();
  });
});
