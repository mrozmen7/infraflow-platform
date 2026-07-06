import { TestBed } from '@angular/core/testing';

import { IncidentRepositoryPort } from '../application';
import type {
  Incident,
  IncidentId,
  IncidentQuery,
  NewIncident,
} from '../domain/incident';
import { IncidentStore } from './incident-store';

const incidents: readonly Incident[] = [
  {
    id: 'INC-STORE-001',
    title: 'Transformer smoke detected',
    description: 'Smoke is visible near the transformer enclosure.',
    location: 'North Tunnel',
    assetId: 'TRF-NT-003',
    reportedAt: '2026-07-04T08:00:00.000Z',
    severity: 'Critical',
    priority: 'P1',
    status: 'Open',
    operationalSignals: ['Smoke detected'],
  },
  {
    id: 'INC-STORE-002',
    title: 'Sensor drift',
    description: 'Temperature sensor readings are drifting.',
    location: 'West Tunnel',
    assetId: 'SNS-WT-002',
    reportedAt: '2026-07-04T08:05:00.000Z',
    severity: 'Medium',
    priority: 'P2',
    status: 'Open',
    operationalSignals: ['Reading variance'],
  },
];

class FakeIncidentRepository implements IncidentRepositoryPort {
  readonly searchQueries: IncidentQuery[] = [];
  saveGate: Promise<void> | null = null;
  saveShouldFail = false;

  search(query: IncidentQuery): Promise<readonly Incident[]> {
    this.searchQueries.push(query);
    return Promise.resolve(
      incidents.filter(
        (incident) => query.severity === 'All' || incident.severity === query.severity,
      ),
    );
  }

  findById(incidentId: IncidentId): Promise<Incident | undefined> {
    return Promise.resolve(incidents.find((incident) => incident.id === incidentId));
  }

  async save(incident: Incident): Promise<Incident> {
    if (this.saveGate) {
      await this.saveGate;
    }

    if (this.saveShouldFail) {
      throw new Error('Simulated save failure');
    }

    return incident;
  }

  create(newIncident: NewIncident): Promise<Incident> {
    return Promise.resolve({
      ...newIncident,
      id: 'INC-STORE-003',
      reportedAt: '2026-07-04T09:00:00.000Z',
      status: 'Open',
    });
  }
}

describe('IncidentStore', () => {
  let repository: FakeIncidentRepository;
  let store: IncidentStore;

  beforeEach(() => {
    repository = new FakeIncidentRepository();
    TestBed.configureTestingModule({
      providers: [
        IncidentStore,
        { provide: IncidentRepositoryPort, useValue: repository },
      ],
    });
    store = TestBed.inject(IncidentStore);
  });

  it('loads incidents and derives a valid initial selection', async () => {
    await vi.waitFor(() => expect(store.loadStatus()).toBe('loaded'));

    expect(store.incidents()).toEqual(incidents);
    expect(store.selectedIncidentId()).toBe('INC-STORE-001');
    expect(store.resultSummary()).toBe('2 incidents found');
    expect(store.lastLoadedAt()).not.toBeNull();
  });

  it('owns query state and reloads when severity changes', async () => {
    await vi.waitFor(() => expect(store.loadStatus()).toBe('loaded'));

    store.setSeverityFilter('Critical');

    await vi.waitFor(() => expect(repository.searchQueries).toHaveLength(2));
    await vi.waitFor(() => expect(store.loadStatus()).toBe('loaded'));
    expect(repository.searchQueries.at(-1)?.severity).toBe('Critical');
    expect(store.incidents().map((incident) => incident.id)).toEqual(['INC-STORE-001']);
  });

  it('reuses a fresh query cache and lets manual reload bypass it', async () => {
    await vi.waitFor(() => expect(store.loadSource()).toBe('network'));

    store.setSeverityFilter('Critical');
    await vi.waitFor(() => expect(repository.searchQueries).toHaveLength(2));
    await vi.waitFor(() => expect(store.incidents()).toHaveLength(1));

    store.setSeverityFilter('All');
    await vi.waitFor(() => expect(store.loadSource()).toBe('cache'));

    expect(repository.searchQueries).toHaveLength(2);
    expect(store.incidents()).toHaveLength(2);

    store.reload();
    await vi.waitFor(() => expect(repository.searchQueries).toHaveLength(3));
    await vi.waitFor(() => expect(store.loadSource()).toBe('network'));
  });

  it('accepts only a selection that exists in the current collection', async () => {
    await vi.waitFor(() => expect(store.loadStatus()).toBe('loaded'));

    store.selectIncident('INC-STORE-002');
    expect(store.selectedIncidentId()).toBe('INC-STORE-002');

    store.selectIncident('INC-MISSING');
    expect(store.selectedIncidentId()).toBe('INC-STORE-002');
  });

  it('updates acknowledgement optimistically and confirms the server result', async () => {
    await vi.waitFor(() => expect(store.loadStatus()).toBe('loaded'));
    let releaseSave = (): void => undefined;
    repository.saveGate = new Promise<void>((resolve) => {
      releaseSave = resolve;
    });

    const acknowledgement = store.acknowledge('INC-STORE-001');

    expect(store.pendingAcknowledgementId()).toBe('INC-STORE-001');
    expect(store.incidents()[0]?.status).toBe('Acknowledged');

    releaseSave();
    await acknowledgement;

    expect(store.pendingAcknowledgementId()).toBeNull();
    expect(store.incidents()[0]?.status).toBe('Acknowledged');
  });

  it('rolls the optimistic acknowledgement back when persistence fails', async () => {
    await vi.waitFor(() => expect(store.loadStatus()).toBe('loaded'));
    repository.saveShouldFail = true;

    await expect(store.acknowledge('INC-STORE-001')).rejects.toThrow(
      'Simulated save failure',
    );

    expect(store.pendingAcknowledgementId()).toBeNull();
    expect(store.incidents()[0]?.status).toBe('Open');
  });

  it('adds a newly created incident to normalized state and selects it', async () => {
    await vi.waitFor(() => expect(store.loadStatus()).toBe('loaded'));

    const created = await store.createIncident({
      title: 'Emergency lighting unavailable',
      description: 'The emergency lighting circuit is offline in the service bay.',
      location: 'South Tunnel',
      assetId: 'LGT-ST-010',
      severity: 'High',
      priority: 'P1',
      operationalSignals: ['Lighting circuit offline'],
    });

    expect(created.id).toBe('INC-STORE-003');
    expect(store.selectedIncidentId()).toBe('INC-STORE-003');
    expect(store.incidents().at(-1)?.id).toBe('INC-STORE-003');
  });
});
