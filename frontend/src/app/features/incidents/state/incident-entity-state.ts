import type { Incident, IncidentId } from '../domain/incident';

export interface IncidentEntityState {
  readonly ids: readonly IncidentId[];
  readonly entities: Readonly<Partial<Record<IncidentId, Incident>>>;
}

export function createEmptyIncidentEntityState(): IncidentEntityState {
  return {
    ids: [],
    entities: {},
  };
}

export function normalizeIncidents(incidents: readonly Incident[]): IncidentEntityState {
  const ids: IncidentId[] = [];
  const entities: Partial<Record<IncidentId, Incident>> = {};

  for (const incident of incidents) {
    if (!(incident.id in entities)) {
      ids.push(incident.id);
    }

    entities[incident.id] = incident;
  }

  return { ids, entities };
}

export function selectAllIncidents(state: IncidentEntityState): readonly Incident[] {
  return state.ids.flatMap((incidentId) => {
    const incident = state.entities[incidentId];
    return incident ? [incident] : [];
  });
}

export function selectIncidentById(
  state: IncidentEntityState,
  incidentId: IncidentId,
): Incident | undefined {
  return state.entities[incidentId];
}

export function upsertIncident(
  state: IncidentEntityState,
  incident: Incident,
): IncidentEntityState {
  const alreadyExists = state.entities[incident.id] !== undefined;

  return {
    ids: alreadyExists ? state.ids : [...state.ids, incident.id],
    entities: {
      ...state.entities,
      [incident.id]: incident,
    },
  };
}
