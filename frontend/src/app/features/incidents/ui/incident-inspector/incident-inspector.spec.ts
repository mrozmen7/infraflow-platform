import { provideRouter } from '@angular/router';
import { TestBed } from '@angular/core/testing';

import { provideTranslateTesting, useEnglishTranslations } from '../../../../../testing/translate-testing';
import type { Incident } from '../../domain/incident';
import { IncidentInspector } from './incident-inspector';

const acknowledgedIncident: Incident = {
  id: 'INC-INSPECT-001',
  title: 'Ventilation response required',
  description: 'The acknowledged alarm requires an active response.',
  location: 'North Tunnel',
  assetId: 'FAN-NT-001',
  reportedAt: '2026-07-06T09:00:00.000Z',
  severity: 'High',
  priority: 'P1',
  status: 'Acknowledged',
  operationalSignals: ['Airflow below threshold'],
};

describe('IncidentInspector', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncidentInspector],
      providers: [provideRouter([]), ...provideTranslateTesting()],
    }).compileComponents();

    useEnglishTranslations();
  });

  it('offers response start only for an acknowledged Incident and emits its id', () => {
    const fixture = TestBed.createComponent(IncidentInspector);
    let requestedIncidentId = '';
    fixture.componentInstance.responseStartRequested.subscribe(
      (incidentId) => (requestedIncidentId = incidentId),
    );
    fixture.componentRef.setInput('incident', acknowledgedIncident);
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    const button = [...element.querySelectorAll<HTMLButtonElement>('footer button')].find(
      (candidate) => candidate.textContent?.includes('Start response'),
    );

    expect(button).toBeTruthy();
    button?.click();
    expect(requestedIncidentId).toBe('INC-INSPECT-001');
  });

  it('does not offer response start for other Incident statuses', () => {
    const fixture = TestBed.createComponent(IncidentInspector);
    fixture.componentRef.setInput('incident', {
      ...acknowledgedIncident,
      status: 'In Progress',
    });
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.textContent).not.toContain('Start response');
  });

  it('shows an accessible disabled control while response start is pending', () => {
    const fixture = TestBed.createComponent(IncidentInspector);
    fixture.componentRef.setInput('incident', acknowledgedIncident);
    fixture.componentRef.setInput('responseStartPending', true);
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    const pendingButton = element.querySelector<HTMLButtonElement>(
      'button[aria-label="Response start in progress"]',
    );

    expect(pendingButton?.disabled).toBe(true);
    expect(pendingButton?.textContent).toContain('Starting response');
  });
});
