import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { acknowledgeIncident } from '../../../../core/api/generated/fn/incidents/acknowledge-incident';
import { createIncident } from '../../../../core/api/generated/fn/incidents/create-incident';
import { getIncident } from '../../../../core/api/generated/fn/incidents/get-incident';
import { searchIncidents } from '../../../../core/api/generated/fn/incidents/search-incidents';
import { startIncidentResponse } from '../../../../core/api/generated/fn/incidents/start-incident-response';
import type { IncidentResponse } from '../../../../core/api/generated/models/incident-response';
import { requireResponseFields } from '../../../../core/api/require-response-fields';
import type { AppRuntimeConfig } from '../../../../core/config/app-runtime-config';
import type { IncidentRepositoryPort } from '../../application';
import {
  type Incident,
  type IncidentId,
  type IncidentPage,
  type IncidentQuery,
  type NewIncident,
  parseIncidentId,
} from '../../domain/incident';

const INCIDENT_REQUIRED_FIELDS = [
  'id',
  'title',
  'description',
  'location',
  'assetId',
  'reportedAt',
  'severity',
  'priority',
  'status',
  'operationalSignals',
] as const;

export class HttpIncidentRepository implements IncidentRepositoryPort {
  constructor(
    private readonly http: HttpClient,
    private readonly runtimeConfig: AppRuntimeConfig,
  ) {}

  async search(query: IncidentQuery): Promise<IncidentPage> {
    const response = await firstValueFrom(
      searchIncidents(this.http, this.rootUrl(), {
        searchTerm: query.searchTerm,
        severity: query.severity,
        page: query.page,
        size: query.size,
      }),
    );
    const page = response.body;

    return {
      incidents: (page.content ?? []).map((incident) => toIncident(incident)),
      page: page.page ?? query.page,
      size: page.size ?? query.size,
      totalElements: page.totalElements ?? 0,
      totalPages: page.totalPages ?? 0,
    };
  }

  async findById(incidentId: IncidentId): Promise<Incident | undefined> {
    const response = await firstValueFrom(
      getIncident(this.http, this.rootUrl(), { incidentId }),
    );

    return toIncident(response.body);
  }

  save(incident: Incident): Promise<Incident> {
    if (incident.status === 'Acknowledged') {
      return firstValueFrom(
        acknowledgeIncident(this.http, this.rootUrl(), { incidentId: incident.id }),
      ).then((response) => toIncident(response.body));
    }

    if (incident.status === 'In Progress') {
      return firstValueFrom(
        startIncidentResponse(this.http, this.rootUrl(), { incidentId: incident.id }),
      ).then((response) => toIncident(response.body));
    }

    return Promise.resolve(incident);
  }

  create(newIncident: NewIncident): Promise<Incident> {
    return firstValueFrom(
      createIncident(this.http, this.rootUrl(), {
        body: { ...newIncident, operationalSignals: [...newIncident.operationalSignals] },
      }),
    ).then((response) => toIncident(response.body));
  }

  private rootUrl(): string {
    // Generated operation paths are contract-absolute (`/api/v1/...`); the
    // runtime config only contributes an optional origin prefix before `/api`.
    return this.runtimeConfig.apiBaseUrl.replace(/\/api$/, '');
  }
}

function toIncident(response: IncidentResponse): Incident {
  requireResponseFields(response, INCIDENT_REQUIRED_FIELDS, 'IncidentResponse');

  return {
    id: parseIncidentId(response.id!),
    title: response.title!,
    description: response.description!,
    location: response.location!,
    assetId: response.assetId!,
    reportedAt: response.reportedAt!,
    severity: response.severity!,
    priority: response.priority!,
    status: response.status!,
    operationalSignals: response.operationalSignals!,
  };
}
