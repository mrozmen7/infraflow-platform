import {
  startIncidentResponse as applyResponseStart,
  type Incident,
  type IncidentId,
  parseIncidentId,
} from '../../domain/incident';
import type { IncidentRepositoryPort } from '../ports/incident-repository.port';
import { IncidentNotFoundError } from './acknowledge-incident';

export async function startIncidentResponse(
  repository: IncidentRepositoryPort,
  rawIncidentId: string,
  abortSignal?: AbortSignal,
): Promise<Incident> {
  const incidentId: IncidentId = parseIncidentId(rawIncidentId);
  const incident = await repository.findById(incidentId, abortSignal);

  if (!incident) {
    throw new IncidentNotFoundError(incidentId);
  }

  return repository.save(applyResponseStart(incident));
}
