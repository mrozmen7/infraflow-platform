import type { IncidentPage, IncidentQuery } from '../../domain/incident';
import type { IncidentRepositoryPort } from '../ports/incident-repository.port';

export function searchIncidents(
  repository: IncidentRepositoryPort,
  query: IncidentQuery,
  abortSignal?: AbortSignal,
): Promise<IncidentPage> {
  return repository.search(
    {
      ...query,
      searchTerm: query.searchTerm.trim(),
    },
    abortSignal,
  );
}
