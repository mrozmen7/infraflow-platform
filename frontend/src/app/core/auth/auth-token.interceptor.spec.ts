import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { APP_RUNTIME_CONFIG, HTTP_APP_RUNTIME_CONFIG } from '../config/app-runtime-config';
import { AuthSessionStore } from './auth-session-store';
import { authTokenInterceptor } from './auth-token.interceptor';

describe('authTokenInterceptor', () => {
  let http: HttpClient;
  let sessionStore: AuthSessionStore;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: APP_RUNTIME_CONFIG, useValue: HTTP_APP_RUNTIME_CONFIG },
        provideHttpClient(withInterceptors([authTokenInterceptor])),
        provideHttpClientTesting(),
      ],
    });

    http = TestBed.inject(HttpClient);
    sessionStore = TestBed.inject(AuthSessionStore);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('adds the in-memory bearer token to protected API calls', async () => {
    const login = sessionStore.login({ username: 'operator', password: 'operator' });
    httpTestingController.expectOne('/api/v1/auth/login').flush({
      tokenType: 'Bearer',
      accessToken: 'mock-token',
      refreshToken: 'mock-refresh',
      roles: ['OPERATOR'],
    });
    await login;

    http.get('/api/v1/incidents').subscribe();

    const request = httpTestingController.expectOne('/api/v1/incidents');
    expect(request.request.headers.get('Authorization')).toBe('Bearer mock-token');
    request.flush([]);
  });

  it('does not attach an authorization header to login requests', () => {
    http.post('/api/v1/auth/login', { username: 'operator', password: 'operator' }).subscribe();

    const request = httpTestingController.expectOne('/api/v1/auth/login');
    expect(request.request.headers.has('Authorization')).toBe(false);
    request.flush({});
  });
});
