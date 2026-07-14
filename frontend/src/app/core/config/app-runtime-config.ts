import { InjectionToken } from '@angular/core';

export interface AppRuntimeConfig {
  readonly apiBaseUrl: string;
  readonly dataAccess: {
    readonly incidents: 'mock' | 'http';
    readonly assets: 'mock' | 'http';
    readonly workOrders: 'mock' | 'http';
  };
  readonly authentication: {
    readonly mode: 'disabled' | 'jwt';
  };
  readonly features: {
    readonly incidents: boolean;
  };
}

export const MOCK_APP_RUNTIME_CONFIG = Object.freeze<AppRuntimeConfig>({
  apiBaseUrl: '/api',
  dataAccess: {
    incidents: 'mock',
    assets: 'mock',
    workOrders: 'mock',
  },
  authentication: {
    mode: 'disabled',
  },
  features: {
    incidents: true,
  },
});

export const HTTP_APP_RUNTIME_CONFIG = Object.freeze<AppRuntimeConfig>({
  apiBaseUrl: '/api',
  dataAccess: {
    incidents: 'http',
    assets: 'http',
    workOrders: 'http',
  },
  authentication: {
    mode: 'jwt',
  },
  features: {
    incidents: true,
  },
});

export const APP_RUNTIME_CONFIG = new InjectionToken<AppRuntimeConfig>('APP_RUNTIME_CONFIG', {
  providedIn: 'root',
  factory: () => MOCK_APP_RUNTIME_CONFIG,
});
