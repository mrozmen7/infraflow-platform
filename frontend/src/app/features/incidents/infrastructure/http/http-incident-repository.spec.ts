import { HttpClient, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { type AppRuntimeConfig } from '../../../../core/config/app-runtime-config';
import { HttpIncidentRepository } from './http-incident-repository';

const runtimeConfig: AppRuntimeConfig = {
  apiBaseUrl: '/api',
  dataAccess: {
    incidents: 'http',
    assets: 'http',
    workOrders: 'http',
  },
  authentication: {
    mode: 'jwt',
  },
  features: {
    incidents: true,
  },
};

describe('HttpIncidentRepository', () => {
  let repository: HttpIncidentRepository;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    httpTestingController = TestBed.inject(HttpTestingController);
    repository = new HttpIncidentRepository(TestBed.inject(HttpClient), runtimeConfig);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('searches incidents through the Spring Boot API contract', async () => {
    const resultPromise = repository.search({
      searchTerm: 'tunnel',
      severity: 'Critical',
      page: 1,
      size: 20,
    });

    const request = httpTestingController.expectOne(
      '/api/v1/incidents?searchTerm=tunnel&severity=Critical&page=1&size=20',
    );
    expect(request.request.method).toBe('GET');
    request.flush({
      content: [
        {
          id: 'INC-2026-0001',
          title: 'Transformer smoke detected',
          description: 'Smoke reported near the transformer room.',
          location: 'North Tunnel · KM 3.0',
          assetId: 'TRF-NT-003',
          reportedAt: '2026-06-30T15:42:00Z',
          severity: 'Critical',
          priority: 'P1',
          status: 'Open',
          operationalSignals: ['Smoke detected'],
        },
      ],
      page: 1,
      size: 20,
      totalElements: 21,
      totalPages: 2,
    });

    await expect(resultPromise).resolves.toEqual({
      incidents: [
        expect.objectContaining({
          id: 'INC-2026-0001',
          severity: 'Critical',
        }),
      ],
      page: 1,
      size: 20,
      totalElements: 21,
      totalPages: 2,
    });
  });
});
