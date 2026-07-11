import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router, UrlSegment, UrlTree } from '@angular/router';

import {
  APP_RUNTIME_CONFIG,
  HTTP_APP_RUNTIME_CONFIG,
  MOCK_APP_RUNTIME_CONFIG,
} from '../config/app-runtime-config';
import { authenticationGuard } from './authentication.guard';

describe('authenticationGuard', () => {
  it('redirects unauthenticated users to login and preserves the requested route', () => {
    configure(HTTP_APP_RUNTIME_CONFIG);

    const result = TestBed.runInInjectionContext(() =>
      authenticationGuard({} as never, [new UrlSegment('incidents', {})], {} as never),
    );

    expect(result).toBeInstanceOf(UrlTree);
    expect(TestBed.inject(Router).serializeUrl(result as UrlTree)).toBe(
      '/login?returnUrl=%2Fincidents',
    );
  });

  it('keeps the deterministic mock mode available for isolated browser tests', () => {
    configure(MOCK_APP_RUNTIME_CONFIG);

    const result = TestBed.runInInjectionContext(() =>
      authenticationGuard({} as never, [new UrlSegment('incidents', {})], {} as never),
    );

    expect(result).toBe(true);
  });
});

function configure(runtimeConfig: typeof HTTP_APP_RUNTIME_CONFIG): void {
  TestBed.configureTestingModule({
    providers: [
      provideHttpClient(),
      provideRouter([]),
      { provide: APP_RUNTIME_CONFIG, useValue: runtimeConfig },
    ],
  });
}
