import type { Incident } from '../../domain/incident';
import {
  IncidentResponseTransitionError,
  InvalidIncidentIdError,
} from '../../domain/incident';
import type { IncidentRepositoryPort } from '../ports/incident-repository.port';
import { IncidentNotFoundError } from './acknowledge-incident';
import { startIncidentResponse } from './start-incident-response';

const acknowledgedIncident: Incident = {
  id: 'INC-RESP-001',
  title: 'Ventilation response required',
  description: 'The ventilation alarm has been acknowledged.',
  location: 'North Tunnel',
  assetId: 'FAN-NT-001',
  reportedAt: '2026-07-06T09:00:00.000Z',
  severity: 'High',
  priority: 'P1',
  status: 'Acknowledged',
  operationalSignals: ['Airflow below threshold'],
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
      search: () =>
        Promise.resolve({
          incidents: [],
          page: 0,
          size: 20,
          totalElements: 0,
          totalPages: 0,
        }),
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
          reportedAt: '2026-07-06T10:00:00.000Z',
          status: 'Open',
        }),
    },
    savedIncidents,
    findCallCount: () => findCalls,
  };
}

describe('startIncidentResponse use case', () => {
  it('loads, transitions and saves an acknowledged Incident', async () => {
    const { repository, savedIncidents } = createRepository(acknowledgedIncident);

    const result = await startIncidentResponse(repository, 'INC-RESP-001');

    expect(result.status).toBe('In Progress');
    expect(savedIncidents).toHaveLength(1);
    expect(savedIncidents[0]?.status).toBe('In Progress');
    expect(acknowledgedIncident.status).toBe('Acknowledged');
  });

  it('rejects a malformed id before accessing the repository', async () => {
    const { repository, findCallCount } = createRepository(acknowledgedIncident);

    await expect(startIncidentResponse(repository, 'WO-RESP-001')).rejects.toBeInstanceOf(
      InvalidIncidentIdError,
    );
    expect(findCallCount()).toBe(0);
  });

  it('reports a missing Incident explicitly', async () => {
    const { repository } = createRepository(undefined);

    await expect(startIncidentResponse(repository, 'INC-MISSING-001')).rejects.toBeInstanceOf(
      IncidentNotFoundError,
    );
  });

  it('does not save a forbidden status transition', async () => {
    const { repository, savedIncidents } = createRepository({
      ...acknowledgedIncident,
      status: 'Open',
    });

    await expect(startIncidentResponse(repository, 'INC-RESP-001')).rejects.toBeInstanceOf(
      IncidentResponseTransitionError,
    );
    expect(savedIncidents).toHaveLength(0);
  });
});
