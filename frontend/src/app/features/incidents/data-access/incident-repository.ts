import { InjectionToken } from '@angular/core';

import { Incident, IncidentQuery } from '../domain/incident';

export interface IncidentRepository {
  search(query: IncidentQuery, abortSignal?: AbortSignal): Promise<readonly Incident[]>;
  findById(incidentId: string, abortSignal?: AbortSignal): Promise<Incident | undefined>;
  acknowledge(incidentId: string): Promise<Incident>;
}

export const INCIDENT_REPOSITORY = new InjectionToken<IncidentRepository>('INCIDENT_REPOSITORY');
