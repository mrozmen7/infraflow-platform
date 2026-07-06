import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  convertToParamMap,
  provideRouter,
  RedirectCommand,
} from '@angular/router';

import { IncidentRepositoryPort } from '../application';
import { Incident } from '../domain/incident';
import { incidentResolver } from './incident.resolver';

const incident: Incident = {
  id: 'INC-TEST-001',
  title: 'Resolver test incident',
  description: 'Test description',
  location: 'North Tunnel',
  assetId: 'TRF-001',
  reportedAt: '2026-06-30T15:42:00.000Z',
  severity: 'Critical',
  priority: 'P1',
  status: 'Open',
  operationalSignals: [],
};

describe('incidentResolver', () => {
  it('resolves an incident before route activation', async () => {
    configureRepository({
      search: () => Promise.resolve([]),
      findById: () => Promise.resolve(incident),
      save: () => Promise.resolve(incident),
      create: (newIncident) => Promise.resolve({ ...incident, ...newIncident }),
    });

    const result = await TestBed.runInInjectionContext(() =>
      incidentResolver(routeSnapshot('INC-TEST-001'), {} as never),
    );

    expect(result).toEqual(incident);
  });

  it('redirects unknown incident ids to the not-found route', async () => {
    configureRepository({
      search: () => Promise.resolve([]),
      findById: () => Promise.resolve(undefined),
      save: () => Promise.resolve(incident),
      create: (newIncident) => Promise.resolve({ ...incident, ...newIncident }),
    });

    const result = await TestBed.runInInjectionContext(() =>
      incidentResolver(routeSnapshot('INC-MISSING'), {} as never),
    );

    expect(result).toBeInstanceOf(RedirectCommand);
  });
});

function configureRepository(repository: IncidentRepositoryPort): void {
  TestBed.configureTestingModule({
    providers: [provideRouter([]), { provide: IncidentRepositoryPort, useValue: repository }],
  });
}

function routeSnapshot(incidentId: string): ActivatedRouteSnapshot {
  return {
    paramMap: convertToParamMap({ incidentId }),
  } as ActivatedRouteSnapshot;
}
