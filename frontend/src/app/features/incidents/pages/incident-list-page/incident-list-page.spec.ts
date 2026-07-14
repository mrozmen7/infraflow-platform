import { provideRouter } from '@angular/router';
import { TestBed } from '@angular/core/testing';

import {
  buildIncidentAgentSnapshot,
  IncidentAgentSessionPort,
  IncidentRepositoryPort,
} from '../../application';
import {
  Incident,
  IncidentId,
  IncidentQuery,
  NewIncident,
} from '../../domain/incident';
import { IncidentStore } from '../../state/incident-store';
import { IncidentListPage } from './incident-list-page';

const incidents: readonly Incident[] = [
  {
    id: 'INC-TEST-001',
    title: 'Transformer smoke detected',
    description: 'Test description',
    location: 'North Tunnel',
    assetId: 'TRF-001',
    reportedAt: '2026-06-30T15:42:00.000Z',
    severity: 'Critical',
    priority: 'P1',
    status: 'Open',
    operationalSignals: ['Smoke detected'],
  },
  {
    id: 'INC-TEST-002',
    title: 'Sensor drift',
    description: 'Test description',
    location: 'West Tunnel',
    assetId: 'SNS-002',
    reportedAt: '2026-06-30T14:42:00.000Z',
    severity: 'High',
    priority: 'P2',
    status: 'In Progress',
    operationalSignals: [],
  },
  {
    id: 'INC-TEST-003',
    title: 'Emergency phone response pending',
    description: 'The acknowledged incident requires an active response.',
    location: 'South Tunnel',
    assetId: 'TEL-003',
    reportedAt: '2026-06-30T13:42:00.000Z',
    severity: 'Medium',
    priority: 'P2',
    status: 'Acknowledged',
    operationalSignals: ['Field confirmation pending'],
  },
];

class FakeIncidentRepository implements IncidentRepositoryPort {
  acknowledgedIncidentId = '';
  responseStartedIncidentId = '';
  searchResult = incidents;
  searchShouldFail = false;
  saveShouldFail = false;

  search(query: IncidentQuery): Promise<readonly Incident[]> {
    if (this.searchShouldFail) {
      return Promise.reject(new Error('Simulated incident request failure'));
    }

    return Promise.resolve(
      this.searchResult.filter(
        (incident) => query.severity === 'All' || incident.severity === query.severity,
      ),
    );
  }

  findById(incidentId: IncidentId): Promise<Incident | undefined> {
    return Promise.resolve(incidents.find((incident) => incident.id === incidentId));
  }

  save(incident: Incident): Promise<Incident> {
    if (this.saveShouldFail) {
      return Promise.reject(new Error('Simulated save failure'));
    }

    if (incident.status === 'Acknowledged') {
      this.acknowledgedIncidentId = incident.id;
    }

    if (incident.status === 'In Progress') {
      this.responseStartedIncidentId = incident.id;
    }
    this.searchResult = this.searchResult.map((current) =>
      current.id === incident.id ? incident : current,
    );
    return Promise.resolve(incident);
  }

  create(newIncident: NewIncident): Promise<Incident> {
    return Promise.resolve({
      ...newIncident,
      id: 'INC-TEST-003',
      reportedAt: '2026-07-04T09:00:00.000Z',
      status: 'Open',
    });
  }
}

class FakeIncidentAgentSessionRepository implements IncidentAgentSessionPort {
  propose(incident: Incident): Promise<NonNullable<ReturnType<typeof buildIncidentAgentSnapshot>>> {
    const snapshot = buildIncidentAgentSnapshot(incident);

    if (!snapshot) {
      return Promise.reject(new Error('Expected incident agent snapshot.'));
    }

    return Promise.resolve(snapshot);
  }
}

describe('IncidentListPage', () => {
  let repository: FakeIncidentRepository;

  beforeEach(async () => {
    repository = new FakeIncidentRepository();

    await TestBed.configureTestingModule({
      imports: [IncidentListPage],
      providers: [
        provideRouter([]),
        IncidentStore,
        { provide: IncidentRepositoryPort, useValue: repository },
        { provide: IncidentAgentSessionPort, useClass: FakeIncidentAgentSessionRepository },
      ],
    }).compileComponents();
  });

  it('renders resource results and keeps a valid linked selection', async () => {
    const fixture = TestBed.createComponent(IncidentListPage);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelectorAll('app-incident-card')).toHaveLength(3);
    expect(element.textContent).toContain('3 incidents found');
    expect(element.querySelector('.incident-card--selected')?.textContent).toContain(
      'INC-TEST-001',
    );
    expect(element.querySelector('app-incident-inspector')?.textContent).toContain('TRF-001');
    expect(element.querySelector('app-incident-inspector')?.textContent).toContain(
      'Transformer smoke detected',
    );
    expect(element.querySelector('app-incident-agent-panel')?.textContent).toContain(
      'Operations assistant',
    );
    expect(element.querySelector('app-incident-agent-panel')?.textContent).toContain(
      'Request supervisor approval',
    );
    expect(element.querySelector('app-incident-agent-panel')?.textContent).toContain(
      'Event timeline',
    );
  });

  it('reviews assistant action cards as operator-controlled intents', async () => {
    const fixture = TestBed.createComponent(IncidentListPage);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    [...element.querySelectorAll<HTMLButtonElement>('app-incident-agent-panel button')]
      .find((button) => button.textContent?.includes('Review action'))
      ?.click();
    fixture.detectChanges();

    expect(element.querySelector('p.visually-hidden')?.textContent).toContain(
      'Review operational context selected.',
    );
    expect(element.querySelector('app-incident-agent-panel')?.textContent).toContain(
      'Action selected: Review operational context',
    );
    expect(repository.acknowledgedIncidentId).toBe('');
    expect(repository.responseStartedIncidentId).toBe('');
  });

  it('runs read-only client-side tools and records tool events without mutating incidents', async () => {
    const fixture = TestBed.createComponent(IncidentListPage);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    [...element.querySelectorAll<HTMLButtonElement>('app-incident-agent-panel button')]
      .find((button) => button.textContent?.includes('Run client tools'))
      ?.click();
    fixture.detectChanges();

    expect(element.querySelector('p.visually-hidden')?.textContent).toContain(
      '3 read-only client-side tools completed.',
    );
    expect(element.querySelector('app-incident-agent-panel')?.textContent).toContain(
      'Read selected incident',
    );
    expect(element.querySelector('app-incident-agent-panel')?.textContent).toContain(
      'tool-result-received',
    );
    expect(repository.acknowledgedIncidentId).toBe('');
    expect(repository.responseStartedIncidentId).toBe('');
  });

  it('creates a human approval request for high-risk assistant actions without mutating incidents', async () => {
    const fixture = TestBed.createComponent(IncidentListPage);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    [...element.querySelectorAll<HTMLButtonElement>('app-incident-agent-panel button')]
      .find((button) => button.textContent?.includes('Review approval path'))
      ?.click();
    fixture.detectChanges();

    expect(element.querySelector('app-incident-agent-panel')?.textContent).toContain(
      'Approval queue',
    );
    expect(element.querySelector('app-incident-agent-panel')?.textContent).toContain(
      'pending',
    );

    [...element.querySelectorAll<HTMLButtonElement>('app-incident-agent-panel button')]
      .find((button) => button.textContent?.includes('Approve'))
      ?.click();
    fixture.detectChanges();

    expect(element.querySelector('p.visually-hidden')?.textContent).toContain(
      'approval approved',
    );
    expect(element.querySelector('app-incident-agent-panel')?.textContent).toContain(
      'approved',
    );
    expect(repository.acknowledgedIncidentId).toBe('');
    expect(repository.responseStartedIncidentId).toBe('');
  });

  it('delegates acknowledgement to the injected repository', async () => {
    const fixture = TestBed.createComponent(IncidentListPage);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    element
      .querySelector<HTMLButtonElement>('app-incident-card button:not(.button-secondary)')
      ?.click();
    await fixture.whenStable();

    expect(repository.acknowledgedIncidentId).toBe('INC-TEST-001');
  });

  it('starts response from the Inspector and updates shared state and metrics', async () => {
    const fixture = TestBed.createComponent(IncidentListPage);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    const thirdCard = element.querySelectorAll<HTMLElement>('app-incident-card')[2];
    thirdCard.querySelector<HTMLButtonElement>('.button-secondary')?.click();
    fixture.detectChanges();

    const startButton = [...element.querySelectorAll<HTMLButtonElement>('app-incident-inspector button')]
      .find((button) => button.textContent?.includes('Start response'));
    expect(startButton).toBeTruthy();

    startButton?.click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(repository.responseStartedIncidentId).toBe('INC-TEST-003');
    expect(element.querySelector('app-incident-inspector')?.textContent).toContain('In Progress');
    expect(thirdCard.textContent).toContain('Status: In Progress');
    expect(element.querySelector('.operations-summary div:nth-child(3) dd')?.textContent).toContain('2');
  });

  it('announces response start failure and rolls the selected Incident back', async () => {
    repository.saveShouldFail = true;
    const fixture = TestBed.createComponent(IncidentListPage);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    const thirdCard = element.querySelectorAll<HTMLElement>('app-incident-card')[2];
    thirdCard.querySelector<HTMLButtonElement>('.button-secondary')?.click();
    fixture.detectChanges();

    [...element.querySelectorAll<HTMLButtonElement>('app-incident-inspector button')]
      .find((button) => button.textContent?.includes('Start response'))
      ?.click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(element.querySelector('p.visually-hidden')?.textContent).toContain(
      'INC-TEST-003 response could not be started.',
    );
    expect(element.querySelector('app-incident-inspector')?.textContent).toContain('Acknowledged');
    expect(thirdCard.textContent).toContain('Status: Acknowledged');
  });

  it('renders an actionable empty state when no incident matches', async () => {
    repository.searchResult = [];
    const fixture = TestBed.createComponent(IncidentListPage);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('app-empty-state')).toBeTruthy();
    expect(element.textContent).toContain('No incidents match these filters');
    expect(element.textContent).toContain('Clear filters');
  });

  it('renders an error state with a retry action when loading fails', async () => {
    repository.searchShouldFail = true;
    const fixture = TestBed.createComponent(IncidentListPage);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    const errorState = element.querySelector<HTMLElement>('[role="alert"]');

    expect(errorState?.textContent).toContain('Incident request failed');
    expect(errorState?.querySelector('button')?.textContent).toContain('Retry');
  });
});
