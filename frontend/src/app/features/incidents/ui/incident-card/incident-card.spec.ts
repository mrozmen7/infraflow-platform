import { TestBed } from '@angular/core/testing';

import { IncidentCard } from './incident-card';

describe('IncidentCard', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncidentCard],
    }).compileComponents();
  });

  it('renders the incident summary', async () => {
    const fixture = TestBed.createComponent(IncidentCard);
    await fixture.whenStable();

    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('h2')?.textContent).toContain(
      'Transformer smoke detected',
    );
    expect(element.textContent).toContain('INC-2026-0001');
    expect(element.textContent).toContain('Critical');
    expect(element.querySelectorAll('.incident-card__signals li')).toHaveLength(3);
    expect(element.textContent).toContain('Immediate safety response required');
  });

  it('acknowledges the incident after the operator action', async () => {
    const fixture = TestBed.createComponent(IncidentCard);
    await fixture.whenStable();

    const element = fixture.nativeElement as HTMLElement;
    const button = element.querySelector('button');

    button?.click();
    await fixture.whenStable();

    expect(element.querySelector('button')).toBeNull();
    expect(element.querySelector('[role="status"]')?.textContent).toContain(
      'Incident acknowledged by operator',
    );
    expect(element.querySelector('article')?.classList).toContain(
      'incident-card--acknowledged',
    );
  });
});
