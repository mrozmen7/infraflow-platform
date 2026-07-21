import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { provideTranslateTesting, useEnglishTranslations } from '../testing/translate-testing';
import { routes } from './app.routes';

describe('application routes', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideRouter(routes, withComponentInputBinding()),
        ...provideTranslateTesting(),
      ],
    });
    useEnglishTranslations();
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

  it('lazy-loads the typed incident creation form before the id route', async () => {
    const harness = await RouterTestingHarness.create('/incidents/new');

    expect(harness.routeNativeElement?.textContent).toContain('Report an incident');
    expect(harness.routeNativeElement?.querySelector('form')).toBeTruthy();
  });

  it('catches unknown URLs with the not-found route', async () => {
    const harness = await RouterTestingHarness.create('/unknown-operation');

    expect(harness.routeNativeElement?.textContent).toContain(
      'This operational view does not exist',
    );
  });
});
