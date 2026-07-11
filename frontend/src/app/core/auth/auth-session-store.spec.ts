import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { APP_RUNTIME_CONFIG, HTTP_APP_RUNTIME_CONFIG } from '../config/app-runtime-config';
import { AuthSessionStore } from './auth-session-store';

describe('AuthSessionStore', () => {
  let sessionStore: AuthSessionStore;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: APP_RUNTIME_CONFIG, useValue: HTTP_APP_RUNTIME_CONFIG },
      ],
    });

    sessionStore = TestBed.inject(AuthSessionStore);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('keeps a validated access token in memory after a successful sign-in', async () => {
    const login = sessionStore.login({ username: 'operator', password: 'operator' });

    const request = httpTestingController.expectOne('/api/v1/auth/login');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ username: 'operator', password: 'operator' });
    request.flush({
      tokenType: 'Bearer',
      accessToken: 'mock-token',
      refreshToken: 'mock-refresh',
      roles: ['OPERATOR'],
    });

    await login;

    expect(sessionStore.isAuthenticated()).toBe(true);
    expect(sessionStore.session()).toEqual({
      tokenType: 'Bearer',
      accessToken: 'mock-token',
      roles: ['OPERATOR'],
    });
    expect(sessionStore.hasRole('ADMIN')).toBe(false);
  });

  it('does not authenticate an invalid token response', async () => {
    const login = sessionStore.login({ username: 'operator', password: 'operator' });

    httpTestingController.expectOne('/api/v1/auth/login').flush({
      tokenType: 'Bearer',
      accessToken: 42,
      roles: ['OPERATOR'],
    });

    await expect(login).rejects.toThrow('unsupported access token');
    expect(sessionStore.session()).toBeNull();
  });

  it('clears the in-memory session on logout', async () => {
    const login = sessionStore.login({ username: 'operator', password: 'operator' });
    httpTestingController.expectOne('/api/v1/auth/login').flush({
      tokenType: 'Bearer',
      accessToken: 'mock-token',
      refreshToken: 'mock-refresh',
      roles: ['OPERATOR'],
    });
    await login;

    sessionStore.logout();

    expect(sessionStore.isAuthenticated()).toBe(false);
    expect(sessionStore.session()).toBeNull();
  });
});
