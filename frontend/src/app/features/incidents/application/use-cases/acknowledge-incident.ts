import {
  acknowledgeIncident as applyAcknowledgement,
  type Incident,
  type IncidentId,
  parseIncidentId,
} from '../../domain/incident';
import type { IncidentRepositoryPort } from '../ports/incident-repository.port';

export class IncidentNotFoundError extends Error {
  constructor(readonly incidentId: IncidentId) {
    super(`Incident "${incidentId}" was not found.`);
    this.name = 'IncidentNotFoundError';
  }
}

export async function acknowledgeIncident(
  repository: IncidentRepositoryPort,
  rawIncidentId: string,
  abortSignal?: AbortSignal,
): Promise<Incident> {
  const incidentId = parseIncidentId(rawIncidentId);
  const incident = await repository.findById(incidentId, abortSignal);

  if (!incident) {
    throw new IncidentNotFoundError(incidentId);
  }

  return repository.save(applyAcknowledgement(incident));
}
