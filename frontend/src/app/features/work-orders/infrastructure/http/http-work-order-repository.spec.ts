import { HttpClient, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { type AppRuntimeConfig } from '../../../../core/config/app-runtime-config';
import { HttpWorkOrderRepository } from './http-work-order-repository';

const runtimeConfig: AppRuntimeConfig = {
  apiBaseUrl: '/api',
  dataAccess: { incidents: 'http', assets: 'http', workOrders: 'http' },
  authentication: { mode: 'jwt' },
  features: { incidents: true },
};

const workOrder = {
  id: 'WO-2026-0001',
  incidentId: 'INC-2026-0001',
  title: 'Inspect north tunnel transformer',
  description: 'Verify field conditions.',
  assetId: 'TRF-NT-003',
  location: 'North Tunnel · KM 3.0',
  priority: 'P1',
  status: 'Draft',
  createdAt: '2026-06-30T16:00:00Z',
};

describe('HttpWorkOrderRepository', () => {
  let repository: HttpWorkOrderRepository;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    httpTestingController = TestBed.inject(HttpTestingController);
    repository = new HttpWorkOrderRepository(TestBed.inject(HttpClient), runtimeConfig);
  });

  afterEach(() => httpTestingController.verify());

  it('loads the work-order queue through the backend contract', async () => {
    const resultPromise = repository.findAll();
    const request = httpTestingController.expectOne('/api/v1/work-orders');

    expect(request.request.method).toBe('GET');
    request.flush([workOrder]);

    await expect(resultPromise).resolves.toEqual([expect.objectContaining({ id: 'WO-2026-0001' })]);
  });

  it('creates a backend-owned draft from an incident id', async () => {
    const resultPromise = repository.draftFromIncident('INC-2026-0001');
    const request = httpTestingController.expectOne('/api/v1/work-orders/drafts');

    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ incidentId: 'INC-2026-0001' });
    request.flush(workOrder, { status: 201, statusText: 'Created' });

    await expect(resultPromise).resolves.toEqual(expect.objectContaining({ incidentId: 'INC-2026-0001' }));
  });
});
