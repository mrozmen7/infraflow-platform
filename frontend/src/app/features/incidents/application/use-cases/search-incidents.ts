import type { Incident, IncidentQuery } from '../../domain/incident';
import type { IncidentRepositoryPort } from '../ports/incident-repository.port';

export function searchIncidents(
  repository: IncidentRepositoryPort,
  query: IncidentQuery,
  abortSignal?: AbortSignal,
): Promise<readonly Incident[]> {
  return repository.search(
    {
      ...query,
      searchTerm: query.searchTerm.trim(),
    },
    abortSignal,
  );
}
