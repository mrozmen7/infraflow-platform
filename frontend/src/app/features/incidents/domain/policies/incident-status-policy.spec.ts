import { Incident } from '../model/incident';
import {
  acknowledgeIncident,
  canStartIncidentResponse,
  canAcknowledgeIncident,
  IncidentResponseTransitionError,
  IncidentStatusTransitionError,
  startIncidentResponse,
} from './incident-status-policy';

const openIncident: Incident = {
  id: 'INC-TEST-001',
  title: 'Transformer smoke detected',
  description: 'Test description',
  location: 'North Tunnel',
  assetId: 'TRF-001',
  reportedAt: '2026-06-30T15:42:00.000Z',
  severity: 'Critical',
  priority: 'P1',
  status: 'Open',
  operationalSignals: ['Smoke detected'],
};

describe('Incident acknowledgement policy', () => {
  it('acknowledges an open Incident without mutating the original entity', () => {
    const acknowledgedIncident = acknowledgeIncident(openIncident);

    expect(acknowledgedIncident.status).toBe('Acknowledged');
    expect(openIncident.status).toBe('Open');
    expect(acknowledgedIncident).not.toBe(openIncident);
  });

  it('exposes whether the acknowledgement command is currently allowed', () => {
    expect(canAcknowledgeIncident(openIncident)).toBe(true);
    expect(canAcknowledgeIncident({ status: 'Resolved' })).toBe(false);
  });

  it('rejects an invalid status transition', () => {
    expect(() => acknowledgeIncident({ ...openIncident, status: 'Acknowledged' })).toThrow(
      IncidentStatusTransitionError,
    );
  });
});

describe('Incident response start policy', () => {
  const acknowledgedIncident: Incident = {
    ...openIncident,
    status: 'Acknowledged',
  };

  it('starts response for an acknowledged Incident without mutating the original entity', () => {
    const inProgressIncident = startIncidentResponse(acknowledgedIncident);

    expect(inProgressIncident.status).toBe('In Progress');
    expect(acknowledgedIncident.status).toBe('Acknowledged');
    expect(inProgressIncident).not.toBe(acknowledgedIncident);
  });

  it('exposes whether response can be started', () => {
    expect(canStartIncidentResponse(acknowledgedIncident)).toBe(true);
    expect(canStartIncidentResponse({ status: 'Open' })).toBe(false);
    expect(canStartIncidentResponse({ status: 'In Progress' })).toBe(false);
    expect(canStartIncidentResponse({ status: 'Resolved' })).toBe(false);
  });

  it('rejects response start from every status except Acknowledged', () => {
    for (const status of ['Open', 'In Progress', 'Resolved'] as const) {
      expect(() => startIncidentResponse({ ...openIncident, status })).toThrow(
        IncidentResponseTransitionError,
      );
    }
  });
});
