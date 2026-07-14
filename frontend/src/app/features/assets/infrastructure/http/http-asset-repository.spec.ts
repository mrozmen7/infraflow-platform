import { HttpClient, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { type AppRuntimeConfig } from '../../../../core/config/app-runtime-config';
import { HttpAssetRepository } from './http-asset-repository';

const runtimeConfig: AppRuntimeConfig = {
  apiBaseUrl: '/api',
  dataAccess: { incidents: 'http', assets: 'http', workOrders: 'http' },
  authentication: { mode: 'jwt' },
  features: { incidents: true },
};

describe('HttpAssetRepository', () => {
  let repository: HttpAssetRepository;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    httpTestingController = TestBed.inject(HttpTestingController);
    repository = new HttpAssetRepository(TestBed.inject(HttpClient), runtimeConfig);
  });

  afterEach(() => httpTestingController.verify());

  it('searches the asset registry through the Spring Boot API contract', async () => {
    const resultPromise = repository.search('transformer');
    const request = httpTestingController.expectOne('/api/v1/assets?searchTerm=transformer');

    expect(request.request.method).toBe('GET');
    request.flush([
      {
        id: 'TRF-NT-003',
        name: 'North tunnel transformer',
        type: 'Transformer',
        location: 'North Tunnel · KM 3.0',
        criticality: 'Critical',
        status: 'Degraded',
        lastInspectedAt: '2026-06-30T14:00:00Z',
      },
    ]);

    await expect(resultPromise).resolves.toEqual([
      expect.objectContaining({ id: 'TRF-NT-003', status: 'Degraded' }),
    ]);
  });

  it('loads one asset by its stable registry id', async () => {
    const resultPromise = repository.findById('TRF-NT-003');
    const request = httpTestingController.expectOne('/api/v1/assets/TRF-NT-003');

    expect(request.request.method).toBe('GET');
    request.flush({
      id: 'TRF-NT-003',
      name: 'North tunnel transformer',
      type: 'Transformer',
      location: 'North Tunnel · KM 3.0',
      criticality: 'Critical',
      status: 'Degraded',
      lastInspectedAt: '2026-06-30T14:00:00Z',
    });

    await expect(resultPromise).resolves.toEqual(
      expect.objectContaining({ id: 'TRF-NT-003' }),
    );
  });
});
