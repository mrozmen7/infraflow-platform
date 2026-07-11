import { inject } from '@angular/core';
import type { CanMatchFn, UrlSegment } from '@angular/router';
import { Router } from '@angular/router';

import { AuthSessionStore } from './auth-session-store';

export const authenticationGuard: CanMatchFn = (_route, segments: UrlSegment[]) => {
  const sessionStore = inject(AuthSessionStore);

  if (sessionStore.isAuthenticated()) {
    return true;
  }

  const router = inject(Router);
  const returnUrl = `/${segments.map((segment) => segment.path).join('/')}`;

  return router.createUrlTree(['/login'], { queryParams: { returnUrl } });
};
