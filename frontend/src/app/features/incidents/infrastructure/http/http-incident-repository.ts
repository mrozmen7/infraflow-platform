import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import type { AppRuntimeConfig } from '../../../../core/config/app-runtime-config';
import type { IncidentRepositoryPort } from '../../application';
import {
  type Incident,
  type IncidentId,
  type IncidentQuery,
  type NewIncident,
} from '../../domain/incident';

export class HttpIncidentRepository implements IncidentRepositoryPort {
  constructor(
    private readonly http: HttpClient,
    private readonly runtimeConfig: AppRuntimeConfig,
  ) {}

  search(query: IncidentQuery): Promise<readonly Incident[]> {
    const params = new HttpParams()
      .set('searchTerm', query.searchTerm)
      .set('severity', query.severity);

    return firstValueFrom(
      this.http.get<readonly Incident[]>(this.incidentsUrl(), { params }),
    );
  }

  findById(incidentId: IncidentId): Promise<Incident | undefined> {
    return firstValueFrom(
      this.http.get<Incident>(`${this.incidentsUrl()}/${incidentId}`),
    );
  }

  save(incident: Incident): Promise<Incident> {
    if (incident.status === 'Acknowledged') {
      return firstValueFrom(
        this.http.post<Incident>(`${this.incidentsUrl()}/${incident.id}/acknowledge`, {}),
      );
    }

    if (incident.status === 'In Progress') {
      return firstValueFrom(
        this.http.post<Incident>(`${this.incidentsUrl()}/${incident.id}/start-response`, {}),
      );
    }

    return Promise.resolve(incident);
  }

  create(newIncident: NewIncident): Promise<Incident> {
    return firstValueFrom(
      this.http.post<Incident>(this.incidentsUrl(), newIncident),
    );
  }

  private incidentsUrl(): string {
    return `${this.runtimeConfig.apiBaseUrl}/v1/incidents`;
  }
}
