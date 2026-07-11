import { HttpErrorResponse, type HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

import { APP_RUNTIME_CONFIG } from '../config/app-runtime-config';
import { AuthSessionStore } from './auth-session-store';

export const authTokenInterceptor: HttpInterceptorFn = (request, next) => {
  const runtimeConfig = inject(APP_RUNTIME_CONFIG);

  if (runtimeConfig.authentication.mode === 'disabled' || !isProtectedApiRequest(request.url, runtimeConfig.apiBaseUrl)) {
    return next(request);
  }

  const sessionStore = inject(AuthSessionStore);
  const router = inject(Router);
  const accessToken = sessionStore.session()?.accessToken;
  const authorizedRequest = accessToken
    ? request.clone({ setHeaders: { Authorization: `Bearer ${accessToken}` } })
    : request;

  return next(authorizedRequest).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        sessionStore.logout();
        void router.navigate(['/login'], { queryParams: { returnUrl: router.url } });
      }

      return throwError(() => error);
    }),
  );
};

function isProtectedApiRequest(url: string, apiBaseUrl: string): boolean {
  return url.startsWith(`${apiBaseUrl}/v1/`) && !url.startsWith(`${apiBaseUrl}/v1/auth/`);
}
