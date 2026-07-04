import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';

import { APP_RUNTIME_CONFIG } from '../../../core/config/app-runtime-config';

export const incidentsFeatureGuard: CanMatchFn = () => {
  const runtimeConfig = inject(APP_RUNTIME_CONFIG);
  const router = inject(Router);

  return runtimeConfig.features.incidents ? true : router.parseUrl('/feature-unavailable');
};
