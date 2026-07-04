import { provideRouter } from '@angular/router';
import { TestBed } from '@angular/core/testing';

import { INCIDENT_REPOSITORY, IncidentRepository } from '../../data-access/incident-repository';
import { Incident, IncidentQuery } from '../../domain/incident';
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
];

class FakeIncidentRepository implements IncidentRepository {
  acknowledgedIncidentId = '';
  searchResult = incidents;
  searchShouldFail = false;

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

  findById(incidentId: string): Promise<Incident | undefined> {
    return Promise.resolve(incidents.find((incident) => incident.id === incidentId));
  }

  acknowledge(incidentId: string): Promise<Incident> {
    this.acknowledgedIncidentId = incidentId;
    return Promise.resolve({ ...incidents[0]!, status: 'Acknowledged' });
  }
}

describe('IncidentListPage', () => {
  let repository: FakeIncidentRepository;

  beforeEach(async () => {
    repository = new FakeIncidentRepository();

    await TestBed.configureTestingModule({
      imports: [IncidentListPage],
      providers: [provideRouter([]), { provide: INCIDENT_REPOSITORY, useValue: repository }],
    }).compileComponents();
  });

  it('renders resource results and keeps a valid linked selection', async () => {
    const fixture = TestBed.createComponent(IncidentListPage);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelectorAll('app-incident-card')).toHaveLength(2);
    expect(element.textContent).toContain('2 incidents found');
    expect(element.querySelector('.incident-card--selected')?.textContent).toContain(
      'INC-TEST-001',
    );
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
