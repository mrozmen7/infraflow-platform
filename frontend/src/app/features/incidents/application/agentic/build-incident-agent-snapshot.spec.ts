import { buildIncidentAgentSnapshot } from './build-incident-agent-snapshot';
import { Incident } from '../../domain/incident';

const baseIncident: Incident = {
  id: 'INC-AGENT-001',
  title: 'Ventilation sensor drift',
  description: 'Sensor values do not match the redundant fallback sensor.',
  location: 'West Tunnel · Ventilation Zone B',
  assetId: 'SNS-WT-118',
  reportedAt: '2026-06-30T14:18:00.000Z',
  severity: 'High',
  priority: 'P2',
  status: 'Acknowledged',
  operationalSignals: ['Sensor mismatch', 'Fallback sensor active'],
};

describe('buildIncidentAgentSnapshot', () => {
  it('returns no agent session when no Incident is selected', () => {
    expect(buildIncidentAgentSnapshot(null)).toBeNull();
  });

  it('builds an advisory snapshot from the selected Incident context', () => {
    const snapshot = buildIncidentAgentSnapshot(baseIncident);

    expect(snapshot?.title).toBe('Operations assistant');
    expect(snapshot?.context).toContainEqual({ label: 'Asset', value: 'SNS-WT-118' });
    expect(snapshot?.cards.map((card) => card.intent)).toEqual([
      'inspect-context',
      'start-response',
      'create-work-order',
    ]);
    expect(snapshot?.cards.find((card) => card.intent === 'start-response')?.requiresApproval).toBe(
      false,
    );
  });

  it('marks critical incident suggestions as approval-required', () => {
    const snapshot = buildIncidentAgentSnapshot({
      ...baseIncident,
      severity: 'Critical',
      priority: 'P1',
      status: 'Open',
    });

    expect(snapshot?.mode).toBe('approval-required');
    expect(snapshot?.cards.some((card) => card.intent === 'request-approval')).toBe(true);
    expect(
      snapshot?.cards.find((card) => card.intent === 'acknowledge-ownership')?.requiresApproval,
    ).toBe(true);
  });
});
