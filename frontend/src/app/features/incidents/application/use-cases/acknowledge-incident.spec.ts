import type { Incident } from '../../domain/incident';
import { IncidentStatusTransitionError, InvalidIncidentIdError } from '../../domain/incident';
import type { IncidentRepositoryPort } from '../ports/incident-repository.port';
import { acknowledgeIncident, IncidentNotFoundError } from './acknowledge-incident';

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

function createRepository(incident: Incident | undefined): {
  readonly repository: IncidentRepositoryPort;
  readonly savedIncidents: Incident[];
  readonly findCallCount: () => number;
} {
  const savedIncidents: Incident[] = [];
  let findCalls = 0;

  return {
    repository: {
      search: () => Promise.resolve([]),
      findById: () => {
        findCalls += 1;
        return Promise.resolve(incident);
      },
      save: (savedIncident) => {
        savedIncidents.push(savedIncident);
        return Promise.resolve(savedIncident);
      },
      create: (newIncident) =>
        Promise.resolve({
          ...newIncident,
          id: 'INC-CREATE-001',
          reportedAt: '2026-07-04T10:00:00.000Z',
          status: 'Open',
        }),
    },
    savedIncidents,
    findCallCount: () => findCalls,
  };
}

describe('acknowledgeIncident use case', () => {
  it('loads, transitions and saves an open Incident', async () => {
    const { repository, savedIncidents } = createRepository(openIncident);

    const result = await acknowledgeIncident(repository, 'INC-TEST-001');

    expect(result.status).toBe('Acknowledged');
    expect(savedIncidents).toHaveLength(1);
    expect(savedIncidents[0]?.status).toBe('Acknowledged');
    expect(openIncident.status).toBe('Open');
  });

  it('rejects a malformed id before accessing the repository', async () => {
    const { repository, findCallCount } = createRepository(openIncident);

    await expect(acknowledgeIncident(repository, 'WO-TEST-001')).rejects.toBeInstanceOf(
      InvalidIncidentIdError,
    );
    expect(findCallCount()).toBe(0);
  });

  it('reports a missing Incident explicitly', async () => {
    const { repository } = createRepository(undefined);

    await expect(acknowledgeIncident(repository, 'INC-MISSING-001')).rejects.toBeInstanceOf(
      IncidentNotFoundError,
    );
  });

  it('does not save a forbidden status transition', async () => {
    const { repository, savedIncidents } = createRepository({
      ...openIncident,
      status: 'Resolved',
    });

    await expect(acknowledgeIncident(repository, 'INC-TEST-001')).rejects.toBeInstanceOf(
      IncidentStatusTransitionError,
    );
    expect(savedIncidents).toHaveLength(0);
  });
});
