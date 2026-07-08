import { Incident, IncidentStatus } from '../model/incident';

export class IncidentStatusTransitionError extends Error {
  constructor(readonly currentStatus: IncidentStatus) {
    super(`An Incident cannot be acknowledged from status "${currentStatus}".`);
    this.name = 'IncidentStatusTransitionError';
  }
}

export class IncidentResponseTransitionError extends Error {
  constructor(readonly currentStatus: IncidentStatus) {
    super(`An Incident response cannot start from status "${currentStatus}".`);
    this.name = 'IncidentResponseTransitionError';
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

export function canStartIncidentResponse(
  incident: Pick<Incident, 'status'>,
): boolean {
  return incident.status === 'Acknowledged';
}

export function startIncidentResponse(incident: Incident): Incident {
  if (!canStartIncidentResponse(incident)) {
    throw new IncidentResponseTransitionError(incident.status);
  }

  return {
    ...incident,
    status: 'In Progress',
  };
}
