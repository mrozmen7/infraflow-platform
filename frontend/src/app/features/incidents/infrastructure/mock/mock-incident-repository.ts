import { Injectable } from '@angular/core';

import type { IncidentRepositoryPort } from '../../application';
import {
  type Incident,
  type IncidentId,
  type IncidentQuery,
  type NewIncident,
  parseIncidentId,
} from '../../domain/incident';

const initialIncidents: readonly Incident[] = [
  {
    id: 'INC-2026-0001',
    title: 'Transformer smoke detected',
    description: 'Smoke and a burnt smell were reported near the north tunnel transformer room.',
    location: 'North Tunnel · KM 3.0',
    assetId: 'TRF-NT-003',
    reportedAt: '2026-06-30T15:42:00.000Z',
    severity: 'Critical',
    priority: 'P1',
    status: 'Open',
    operationalSignals: ['Smoke detected', 'Lighting unavailable', 'Traffic active'],
  },
  {
    id: 'INC-2026-0002',
    title: 'Ventilation sensor drift',
    description: 'Air-flow readings differ from the redundant sensor by more than eight percent.',
    location: 'West Tunnel · Ventilation Zone B',
    assetId: 'SNS-WT-118',
    reportedAt: '2026-06-30T14:18:00.000Z',
    severity: 'High',
    priority: 'P2',
    status: 'In Progress',
    operationalSignals: ['Sensor mismatch', 'Fallback sensor active'],
  },
  {
    id: 'INC-2026-0003',
    title: 'Emergency phone inspection due',
    description: 'The scheduled functional check has not yet been confirmed by the field team.',
    location: 'South Tunnel · Bay 12',
    assetId: 'TEL-ST-012',
    reportedAt: '2026-06-29T08:05:00.000Z',
    severity: 'Medium',
    priority: 'P3',
    status: 'Acknowledged',
    operationalSignals: [],
  },
];

@Injectable()
export class MockIncidentRepository implements IncidentRepositoryPort {
  private incidents = initialIncidents.map((incident) => ({ ...incident }));
  private nextIncidentSequence = initialIncidents.length + 1;

  async search(query: IncidentQuery, abortSignal?: AbortSignal): Promise<readonly Incident[]> {
    await waitForMockNetwork(180, abortSignal);

    const normalizedSearchTerm = query.searchTerm.trim().toLocaleLowerCase();

    return this.incidents.filter((incident) => {
      const matchesSeverity = query.severity === 'All' || incident.severity === query.severity;
      const searchableText = [incident.id, incident.title, incident.location, incident.assetId]
        .join(' ')
        .toLocaleLowerCase();

      return matchesSeverity && searchableText.includes(normalizedSearchTerm);
    });
  }

  async findById(
    incidentId: IncidentId,
    abortSignal?: AbortSignal,
  ): Promise<Incident | undefined> {
    await waitForMockNetwork(120, abortSignal);
    return this.incidents.find((incident) => incident.id === incidentId);
  }

  save(incident: Incident): Promise<Incident> {
    const incidentIndex = this.incidents.findIndex((current) => current.id === incident.id);

    if (incidentIndex === -1) {
      return Promise.reject(new Error(`Incident ${incident.id} was not found.`));
    }

    this.incidents = this.incidents.map((current, index) =>
      index === incidentIndex ? incident : current,
    );

    return Promise.resolve(incident);
  }

  async create(newIncident: NewIncident): Promise<Incident> {
    await waitForMockNetwork(180);

    const incident: Incident = {
      ...newIncident,
      id: parseIncidentId(
        `INC-${new Date().getUTCFullYear()}-${String(this.nextIncidentSequence).padStart(4, '0')}`,
      ),
      reportedAt: new Date().toISOString(),
      status: 'Open',
    };

    this.nextIncidentSequence += 1;
    this.incidents = [incident, ...this.incidents];
    return incident;
  }
}

function waitForMockNetwork(durationMs: number, abortSignal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (abortSignal?.aborted) {
      reject(abortSignal.reason);
      return;
    }

    const timeoutId = globalThis.setTimeout(resolve, durationMs);

    abortSignal?.addEventListener(
      'abort',
      () => {
        globalThis.clearTimeout(timeoutId);
        reject(abortSignal.reason);
      },
      { once: true },
    );
  });
}
