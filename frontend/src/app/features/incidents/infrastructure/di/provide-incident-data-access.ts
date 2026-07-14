import { HttpClient } from '@angular/common/http';
import { APP_RUNTIME_CONFIG, type AppRuntimeConfig } from '../../../../core/config/app-runtime-config';
import type { Provider } from '@angular/core';

import { IncidentAgentSessionPort, IncidentRepositoryPort } from '../../application';
import { HttpIncidentAgentSessionRepository } from '../http/http-incident-agent-session.repository';
import { HttpIncidentRepository } from '../http/http-incident-repository';
import { MockIncidentAgentSessionRepository } from '../mock/mock-incident-agent-session.repository';
import { MockIncidentRepository } from '../mock/mock-incident-repository';

export function provideIncidentDataAccess(): Provider[] {
  return [
    {
      provide: IncidentRepositoryPort,
      useFactory: (runtimeConfig: AppRuntimeConfig, http: HttpClient) =>
        runtimeConfig.dataAccess.incidents === 'http'
          ? new HttpIncidentRepository(http, runtimeConfig)
          : new MockIncidentRepository(),
      deps: [APP_RUNTIME_CONFIG, HttpClient],
    },
    {
      provide: IncidentAgentSessionPort,
      useFactory: (runtimeConfig: AppRuntimeConfig, http: HttpClient) =>
        runtimeConfig.dataAccess.incidents === 'http'
          ? new HttpIncidentAgentSessionRepository(http, runtimeConfig)
          : new MockIncidentAgentSessionRepository(),
      deps: [APP_RUNTIME_CONFIG, HttpClient],
    },
  ];
}
