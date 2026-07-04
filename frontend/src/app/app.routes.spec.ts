import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { routes } from './app.routes';

describe('application routes', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter(routes, withComponentInputBinding())],
    });
  });

  it('lazy-loads the assets feature route', async () => {
    const harness = await RouterTestingHarness.create('/assets');

    expect(harness.routeNativeElement?.textContent).toContain('Infrastructure assets');
  });

  it('resolves data for the lazy incident detail route', async () => {
    const harness = await RouterTestingHarness.create('/incidents/INC-2026-0001');

    expect(harness.routeNativeElement?.textContent).toContain('Transformer smoke detected');
    expect(harness.routeNativeElement?.textContent).toContain('TRF-NT-003');
  });

  it('catches unknown URLs with the not-found route', async () => {
    const harness = await RouterTestingHarness.create('/unknown-operation');

    expect(harness.routeNativeElement?.textContent).toContain(
      'This operational view does not exist',
    );
  });
});
