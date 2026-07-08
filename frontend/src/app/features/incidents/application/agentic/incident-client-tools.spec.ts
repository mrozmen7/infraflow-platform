import { buildIncidentAgentSnapshot } from './build-incident-agent-snapshot';
import { buildIncidentClientToolResults } from './incident-client-tools';
import { Incident } from '../../domain/incident';

const selectedIncident: Incident = {
  id: 'INC-2026-0001',
  title: 'Transformer smoke detected',
  description: 'Smoke and a burnt smell were reported.',
  location: 'North Tunnel · KM 3.0',
  assetId: 'TRF-NT-003',
  reportedAt: '2026-06-30T15:42:00.000Z',
  severity: 'Critical',
  priority: 'P1',
  status: 'Open',
  operationalSignals: ['Smoke detected', 'Traffic active'],
};

const inProgressIncident: Incident = {
  ...selectedIncident,
  id: 'INC-2026-0002',
  title: 'Ventilation sensor drift',
  assetId: 'SNS-WT-118',
  severity: 'High',
  priority: 'P2',
  status: 'In Progress',
  operationalSignals: ['Sensor mismatch'],
};

describe('buildIncidentClientToolResults', () => {
  it('builds read-only tool results from selected incident and visible queue state', () => {
    const snapshot = buildIncidentAgentSnapshot(selectedIncident);

    expect(snapshot).toBeTruthy();

    const results = buildIncidentClientToolResults({
      snapshot: snapshot!,
      selectedIncident,
      visibleIncidents: [selectedIncident, inProgressIncident],
      at: '2026-07-07T09:00:00.000Z',
    });

    expect(results.map((result) => result.toolName)).toEqual([
      'read-selected-incident',
      'summarize-visible-queue',
      'inspect-approval-boundary',
    ]);
    expect(results.every((result) => result.permission === 'read-only')).toBe(true);
    expect(results[0].facts).toContain('Asset: TRF-NT-003.');
    expect(results[1].summary).toBe('2 visible incidents, 1 critical open.');
    expect(results[2].facts).toContain('Client-side tools cannot execute mutations.');
  });
});
