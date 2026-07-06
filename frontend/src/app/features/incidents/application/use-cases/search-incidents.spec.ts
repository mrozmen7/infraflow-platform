import type { IncidentQuery } from '../../domain/incident';
import type { IncidentRepositoryPort } from '../ports/incident-repository.port';
import { searchIncidents } from './search-incidents';

describe('searchIncidents', () => {
  it('normalizes the query before delegating to the repository port', async () => {
    let receivedQuery: IncidentQuery | undefined;
    const abortController = new AbortController();
    let receivedAbortSignal: AbortSignal | undefined;

    const repository: IncidentRepositoryPort = {
      search: (query, abortSignal) => {
        receivedQuery = query;
        receivedAbortSignal = abortSignal;
        return Promise.resolve([]);
      },
      findById: () => Promise.resolve(undefined),
      save: (incident) => Promise.resolve(incident),
      create: (newIncident) =>
        Promise.resolve({
          ...newIncident,
          id: 'INC-CREATE-001',
          reportedAt: '2026-07-04T10:00:00.000Z',
          status: 'Open',
        }),
    };

    await searchIncidents(
      repository,
      { searchTerm: '  transformer  ', severity: 'Critical' },
      abortController.signal,
    );

    expect(receivedQuery).toEqual({ searchTerm: 'transformer', severity: 'Critical' });
    expect(receivedAbortSignal).toBe(abortController.signal);
  });
});
