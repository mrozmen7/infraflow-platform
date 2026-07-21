import { provideRouter } from '@angular/router';
import { TestBed } from '@angular/core/testing';

import { provideTranslateTesting, useEnglishTranslations } from '../../../../../testing/translate-testing';
import { Incident } from '../../domain/incident';
import { IncidentCard } from './incident-card';

const criticalIncident: Incident = {
  id: 'INC-TEST-001',
  title: 'Transformer smoke detected',
  description: 'Test description',
  location: 'North Tunnel · KM 3.0',
  assetId: 'TRF-001',
  reportedAt: '2026-06-30T15:42:00.000Z',
  severity: 'Critical',
  priority: 'P1',
  status: 'Open',
  operationalSignals: ['Smoke detected', 'Traffic active'],
};

describe('IncidentCard', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncidentCard],
      providers: [provideRouter([]), ...provideTranslateTesting()],
    }).compileComponents();

    useEnglishTranslations();
  });

  it('renders the required incident input', async () => {
    const fixture = TestBed.createComponent(IncidentCard);
    fixture.componentRef.setInput('incident', criticalIncident);
    fixture.detectChanges();
    await fixture.whenStable();

    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('h2')?.textContent).toContain('Transformer smoke detected');
    expect(element.textContent).toContain('INC-TEST-001');
    expect(element.textContent).toContain('Immediate safety response required');
    expect(element.querySelectorAll('.incident-card__signals li')).toHaveLength(2);
  });

  it('emits the incident id without mutating parent-owned state', async () => {
    const fixture = TestBed.createComponent(IncidentCard);
    fixture.componentRef.setInput('incident', criticalIncident);
    fixture.detectChanges();
    await fixture.whenStable();

    let acknowledgedIncidentId = '';
    fixture.componentInstance.acknowledgeRequested.subscribe(
      (incidentId) => (acknowledgedIncidentId = incidentId),
    );

    const element = fixture.nativeElement as HTMLElement;
    element.querySelector<HTMLButtonElement>('button:not(.button-secondary)')?.click();

    expect(acknowledgedIncidentId).toBe('INC-TEST-001');
    expect(criticalIncident.status).toBe('Open');
  });

  it('removes the acknowledge action when the incident is not open', async () => {
    const fixture = TestBed.createComponent(IncidentCard);
    fixture.componentRef.setInput('incident', {
      ...criticalIncident,
      status: 'Acknowledged',
    });
    fixture.detectChanges();
    await fixture.whenStable();

    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelectorAll('button')).toHaveLength(1);
    expect(element.textContent).toContain('Status: Acknowledged');
  });

  it('disables acknowledgement while the command is pending', async () => {
    const fixture = TestBed.createComponent(IncidentCard);
    fixture.componentRef.setInput('incident', {
      ...criticalIncident,
      status: 'Acknowledged',
    });
    fixture.componentRef.setInput('acknowledgementPending', true);
    fixture.detectChanges();
    await fixture.whenStable();

    const element = fixture.nativeElement as HTMLElement;
    const pendingButton = element.querySelector<HTMLButtonElement>(
      'button[aria-label="Acknowledgement in progress"]',
    );

    expect(pendingButton?.disabled).toBe(true);
    expect(pendingButton?.textContent).toContain('Acknowledging');
  });
});
