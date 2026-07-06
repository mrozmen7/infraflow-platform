import type { Incident, NewIncident } from '../../domain/incident';
import type { IncidentRepositoryPort } from '../ports/incident-repository.port';

export class InvalidNewIncidentError extends Error {
  constructor(readonly fieldName: keyof NewIncident) {
    super(`New Incident field "${fieldName}" cannot be empty.`);
    this.name = 'InvalidNewIncidentError';
  }
}

export function createIncident(
  repository: IncidentRepositoryPort,
  newIncident: NewIncident,
): Promise<Incident> {
  const normalizedIncident: NewIncident = {
    ...newIncident,
    title: requireText('title', newIncident.title),
    description: requireText('description', newIncident.description),
    location: requireText('location', newIncident.location),
    assetId: requireText('assetId', newIncident.assetId).toUpperCase(),
    operationalSignals: newIncident.operationalSignals
      .map((signal) => signal.trim())
      .filter((signal, index, signals) => signal.length > 0 && signals.indexOf(signal) === index),
  };

  return repository.create(normalizedIncident);
}

function requireText(fieldName: keyof NewIncident, value: string): string {
  const normalizedValue = value.trim();

  if (!normalizedValue) {
    throw new InvalidNewIncidentError(fieldName);
  }

  return normalizedValue;
}
