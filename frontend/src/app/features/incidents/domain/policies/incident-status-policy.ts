import { Incident, IncidentStatus } from '../model/incident';

export class IncidentStatusTransitionError extends Error {
  constructor(readonly currentStatus: IncidentStatus) {
    super(`An Incident cannot be acknowledged from status "${currentStatus}".`);
    this.name = 'IncidentStatusTransitionError';
  }
}

export function canAcknowledgeIncident(incident: Pick<Incident, 'status'>): boolean {
  return incident.status === 'Open';
}

export function acknowledgeIncident(incident: Incident): Incident {
  if (!canAcknowledgeIncident(incident)) {
    throw new IncidentStatusTransitionError(incident.status);
  }

  return {
    ...incident,
    status: 'Acknowledged',
  };
}
