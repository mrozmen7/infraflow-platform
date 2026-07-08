import { HttpClient } from '@angular/common/http';
import { APP_RUNTIME_CONFIG, type AppRuntimeConfig } from '../../../../core/config/app-runtime-config';
import type { Provider } from '@angular/core';

import { IncidentRepositoryPort } from '../../application';
import { HttpIncidentRepository } from '../http/http-incident-repository';
import { MockIncidentRepository } from '../mock/mock-incident-repository';

export function provideIncidentDataAccess(): Provider {
  return {
    provide: IncidentRepositoryPort,
    useFactory: (runtimeConfig: AppRuntimeConfig, http: HttpClient) =>
      runtimeConfig.dataAccess.incidents === 'http'
        ? new HttpIncidentRepository(http, runtimeConfig)
        : new MockIncidentRepository(),
    deps: [APP_RUNTIME_CONFIG, HttpClient],
  };
}
