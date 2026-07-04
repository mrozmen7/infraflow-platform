import { InjectionToken } from '@angular/core';

export interface AppRuntimeConfig {
  readonly apiBaseUrl: string;
  readonly features: {
    readonly incidents: boolean;
  };
}

export const APP_RUNTIME_CONFIG = new InjectionToken<AppRuntimeConfig>('APP_RUNTIME_CONFIG', {
  providedIn: 'root',
  factory: () => ({
    apiBaseUrl: '/api',
    features: {
      incidents: true,
    },
  }),
});
