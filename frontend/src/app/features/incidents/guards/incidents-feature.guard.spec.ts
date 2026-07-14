import { TestBed } from '@angular/core/testing';
import { provideRouter, Router, UrlTree } from '@angular/router';

import { APP_RUNTIME_CONFIG, AppRuntimeConfig } from '../../../core/config/app-runtime-config';
import { incidentsFeatureGuard } from './incidents-feature.guard';

describe('incidentsFeatureGuard', () => {
  it('allows the route when the runtime feature flag is enabled', () => {
    configureRuntimeConfig(true);

    const result = TestBed.runInInjectionContext(() =>
      incidentsFeatureGuard({} as never, [], {} as never),
    );

    expect(result).toBe(true);
  });

  it('returns a redirect UrlTree when the feature is disabled', () => {
    configureRuntimeConfig(false);

    const result = TestBed.runInInjectionContext(() =>
      incidentsFeatureGuard({} as never, [], {} as never),
    );

    expect(result).toBeInstanceOf(UrlTree);
    expect(TestBed.inject(Router).serializeUrl(result as UrlTree)).toBe('/feature-unavailable');
  });
});

function configureRuntimeConfig(incidentsEnabled: boolean): void {
  const runtimeConfig: AppRuntimeConfig = {
    apiBaseUrl: '/api',
    dataAccess: {
      incidents: 'mock',
      assets: 'mock',
      workOrders: 'mock',
    },
    authentication: {
      mode: 'disabled',
    },
    features: { incidents: incidentsEnabled },
  };

  TestBed.configureTestingModule({
    providers: [provideRouter([]), { provide: APP_RUNTIME_CONFIG, useValue: runtimeConfig }],
  });
}
