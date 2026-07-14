import { HttpClient, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import type { AppRuntimeConfig } from '../../../../core/config/app-runtime-config';
import type { Incident } from '../../domain/incident';
import { HttpIncidentAgentSessionRepository } from './http-incident-agent-session.repository';

const runtimeConfig: AppRuntimeConfig = {
  apiBaseUrl: '/api',
  dataAccess: { incidents: 'http', assets: 'http', workOrders: 'http' },
  authentication: { mode: 'jwt' },
  features: { incidents: true },
};

const selectedIncident: Incident = {
  id: 'INC-2026-0001',
  title: 'Transformer smoke detected',
  description: 'Smoke reported near the transformer room.',
  location: 'North Tunnel · KM 3.0',
  assetId: 'TRF-NT-003',
  reportedAt: '2026-06-30T15:42:00.000Z',
  severity: 'Critical',
  priority: 'P1',
  status: 'Open',
  operationalSignals: ['Smoke detected'],
};

describe('HttpIncidentAgentSessionRepository', () => {
  let repository: HttpIncidentAgentSessionRepository;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    httpTestingController = TestBed.inject(HttpTestingController);
    repository = new HttpIncidentAgentSessionRepository(TestBed.inject(HttpClient), runtimeConfig);
  });

  afterEach(() => httpTestingController.verify());

  it('maps the provider-neutral backend proposal to allow-listed Angular action cards', async () => {
    const proposal = repository.propose(selectedIncident);
    const request = httpTestingController.expectOne('/api/v1/agent-sessions/incidents/INC-2026-0001');

    expect(request.request.method).toBe('GET');
    request.flush({
      sessionId: 'agent-inc-2026-0001',
      provider: 'mock-rule-runtime',
      mode: 'approval-required',
      incidentId: 'INC-2026-0001',
      recommendations: [
        {
          id: 'review-context',
          priority: 'LOW',
          title: 'Review operational context',
          summary: 'Confirm linked asset and workflow state before acting.',
          requiresApproval: false,
        },
        {
          id: 'draft-work-order',
          priority: 'MEDIUM',
          title: 'Draft a work order',
          summary: 'Create a controlled draft from verified incident context.',
          requiresApproval: true,
        },
      ],
      renderBlocks: [],
      tools: [],
      guardrails: ['Assistant output is advisory.'],
    });

    await expect(proposal).resolves.toMatchObject({
      id: 'agent-inc-2026-0001',
      mode: 'approval-required',
      context: expect.arrayContaining([{ label: 'Asset', value: 'TRF-NT-003' }]),
      cards: [
        expect.objectContaining({ intent: 'inspect-context', requiresApproval: false }),
        expect.objectContaining({ intent: 'create-work-order', requiresApproval: true }),
      ],
    });
  });

  it('rejects an unexpected backend recommendation instead of rendering an arbitrary action', async () => {
    const proposal = repository.propose(selectedIncident);
    const request = httpTestingController.expectOne('/api/v1/agent-sessions/incidents/INC-2026-0001');

    request.flush({
      sessionId: 'agent-inc-2026-0001',
      provider: 'mock-rule-runtime',
      mode: 'advisory',
      incidentId: 'INC-2026-0001',
      recommendations: [
        {
          id: 'delete-everything',
          priority: 'CRITICAL',
          title: 'Unsafe action',
          summary: 'Do something unapproved.',
          requiresApproval: false,
        },
      ],
      guardrails: [],
    });

    await expect(proposal).rejects.toThrow('Unsupported agent recommendation');
  });
});
