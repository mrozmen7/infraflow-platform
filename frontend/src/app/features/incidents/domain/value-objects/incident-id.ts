const INCIDENT_ID_PATTERN = /^INC-[A-Z0-9]+(?:-[A-Z0-9]+)*$/;

export type IncidentId = `INC-${string}`;

export class InvalidIncidentIdError extends Error {
  constructor(readonly invalidValue: string) {
    super(`Invalid Incident id: "${invalidValue}".`);
    this.name = 'InvalidIncidentIdError';
  }
}

export function isIncidentId(value: string): value is IncidentId {
  return INCIDENT_ID_PATTERN.test(value);
}

export function parseIncidentId(rawValue: string): IncidentId {
  const value = rawValue.trim();

  if (!isIncidentId(value)) {
    throw new InvalidIncidentIdError(rawValue);
  }

  return value;
}
