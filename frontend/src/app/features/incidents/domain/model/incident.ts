import { IncidentId } from '../value-objects/incident-id';

export const incidentSeverities = ['Low', 'Medium', 'High', 'Critical'] as const;

export type IncidentSeverity = (typeof incidentSeverities)[number];
export type IncidentSeverityFilter = IncidentSeverity | 'All';
export type IncidentPriority = 'P1' | 'P2' | 'P3' | 'P4';
export type IncidentStatus = 'Open' | 'Acknowledged' | 'In Progress' | 'Resolved';

export interface Incident {
  readonly id: IncidentId;
  readonly title: string;
  readonly description: string;
  readonly location: string;
  readonly assetId: string;
  readonly reportedAt: string;
  readonly severity: IncidentSeverity;
  readonly priority: IncidentPriority;
  readonly status: IncidentStatus;
  readonly operationalSignals: readonly string[];
}

export interface NewIncident {
  readonly title: string;
  readonly description: string;
  readonly location: string;
  readonly assetId: string;
  readonly severity: IncidentSeverity;
  readonly priority: IncidentPriority;
  readonly operationalSignals: readonly string[];
}

export interface IncidentQuery {
  readonly searchTerm: string;
  readonly severity: IncidentSeverityFilter;
}
