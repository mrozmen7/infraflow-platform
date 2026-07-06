import type {
  Incident,
  IncidentId,
  IncidentQuery,
  NewIncident,
} from '../../domain/incident';

export abstract class IncidentRepositoryPort {
  abstract search(
    query: IncidentQuery,
    abortSignal?: AbortSignal,
  ): Promise<readonly Incident[]>;
  abstract findById(
    incidentId: IncidentId,
    abortSignal?: AbortSignal,
  ): Promise<Incident | undefined>;
  abstract save(incident: Incident): Promise<Incident>;
  abstract create(newIncident: NewIncident): Promise<Incident>;
}
