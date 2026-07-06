import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import type { Incident, NewIncident } from '../../domain/incident';
import { IncidentStore } from '../../state/incident-store';
import { IncidentCreatePage } from './incident-create-page';

@Component({ template: '' })
class TestIncidentDestination {}

const createdIncident: Incident = {
  id: 'INC-FORM-001',
  title: 'North Tunnel ventilation stopped',
  description: 'The ventilation unit no longer reports measurable airflow.',
  location: 'North Tunnel · KM 3.0',
  assetId: 'FAN-NT-003',
  severity: 'Medium',
  priority: 'P2',
  reportedAt: '2026-07-04T10:00:00.000Z',
  status: 'Open',
  operationalSignals: ['Airflow unavailable'],
};

describe('IncidentCreatePage', () => {
  let createIncident: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    createIncident = vi.fn<(newIncident: NewIncident) => Promise<Incident>>(() =>
      Promise.resolve(createdIncident),
    );

    await TestBed.configureTestingModule({
      imports: [IncidentCreatePage],
      providers: [
        provideRouter([
          {
            path: 'incidents/:incidentId',
            component: TestIncidentDestination,
          },
        ]),
        {
          provide: IncidentStore,
          useValue: { createIncident },
        },
      ],
    }).compileComponents();
  });

  it('blocks invalid submission, displays errors, and focuses the first invalid field', async () => {
    const fixture = TestBed.createComponent(IncidentCreatePage);
    fixture.detectChanges();
    await fixture.whenStable();

    const element = fixture.nativeElement as HTMLElement;
    element.querySelector<HTMLFormElement>('form')?.requestSubmit();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(createIncident).not.toHaveBeenCalled();
    expect(element.textContent).toContain('Title is required.');
    expect(element.textContent).toContain('Description is required.');
    expect(document.activeElement?.id).toBe('incident-title');
  });

  it('enforces cross-field safety rules for critical incidents', async () => {
    const fixture = TestBed.createComponent(IncidentCreatePage);
    fixture.detectChanges();
    await fixture.whenStable();

    const element = fixture.nativeElement as HTMLElement;
    setTextValue(element, '#incident-title', 'Transformer smoke detected');
    setTextValue(
      element,
      '#incident-description',
      'Smoke is visible near the transformer enclosure and traffic remains active.',
    );
    setTextValue(element, '#incident-location', 'North Tunnel');
    setTextValue(element, '#incident-asset-id', 'TRF-NT-003');
    setSelectValue(element, '#incident-severity', 'Critical');

    element.querySelector<HTMLFormElement>('form')?.requestSubmit();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(createIncident).not.toHaveBeenCalled();
    expect(element.textContent).toContain('Critical incidents must use priority P1.');
    expect(element.textContent).toContain(
      'Critical incidents require immediate safety risk confirmation.',
    );
  });

  it('submits a valid typed draft and navigates to the created incident', async () => {
    const fixture = TestBed.createComponent(IncidentCreatePage);
    const router = TestBed.inject(Router);
    const navigate = vi.spyOn(router, 'navigate');
    fixture.detectChanges();
    await fixture.whenStable();

    const element = fixture.nativeElement as HTMLElement;
    setTextValue(element, '#incident-title', 'North Tunnel ventilation stopped');
    setTextValue(
      element,
      '#incident-description',
      'The ventilation unit no longer reports measurable airflow.',
    );
    setTextValue(element, '#incident-location', 'North Tunnel · KM 3.0');
    setTextValue(element, '#incident-asset-id', 'FAN-NT-003');
    setTextValue(element, '#incident-signals', 'Airflow unavailable; Traffic active');

    element.querySelector<HTMLFormElement>('form')?.requestSubmit();
    await fixture.whenStable();

    expect(createIncident).toHaveBeenCalledWith({
      title: 'North Tunnel ventilation stopped',
      description: 'The ventilation unit no longer reports measurable airflow.',
      location: 'North Tunnel · KM 3.0',
      assetId: 'FAN-NT-003',
      severity: 'Medium',
      priority: 'P2',
      operationalSignals: ['Airflow unavailable', 'Traffic active'],
    });
    expect(navigate).toHaveBeenCalledWith(['/incidents', 'INC-FORM-001']);
  });

  it('surfaces a repository failure as a submission error', async () => {
    createIncident.mockRejectedValueOnce(new Error('Simulated create failure'));
    const fixture = TestBed.createComponent(IncidentCreatePage);
    fixture.detectChanges();
    await fixture.whenStable();

    const element = fixture.nativeElement as HTMLElement;
    setTextValue(element, '#incident-title', 'North Tunnel ventilation stopped');
    setTextValue(
      element,
      '#incident-description',
      'The ventilation unit no longer reports measurable airflow.',
    );
    setTextValue(element, '#incident-location', 'North Tunnel · KM 3.0');
    setTextValue(element, '#incident-asset-id', 'FAN-NT-003');

    element.querySelector<HTMLFormElement>('form')?.requestSubmit();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(element.querySelector('[role="alert"]')?.textContent).toContain(
      'The incident could not be created.',
    );
  });
});

function setTextValue(root: HTMLElement, selector: string, value: string): void {
  const control = root.querySelector<HTMLInputElement | HTMLTextAreaElement>(selector);
  if (!control) {
    throw new Error(`Control not found: ${selector}`);
  }

  control.value = value;
  control.dispatchEvent(new Event('input', { bubbles: true }));
}

function setSelectValue(root: HTMLElement, selector: string, value: string): void {
  const control = root.querySelector<HTMLSelectElement>(selector);
  if (!control) {
    throw new Error(`Control not found: ${selector}`);
  }

  control.value = value;
  control.dispatchEvent(new Event('input', { bubbles: true }));
  control.dispatchEvent(new Event('change', { bubbles: true }));
}
