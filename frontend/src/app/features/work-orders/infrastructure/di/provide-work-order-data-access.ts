import type { Provider } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { APP_RUNTIME_CONFIG, type AppRuntimeConfig } from '../../../../core/config/app-runtime-config';
import { WorkOrderRepositoryPort } from '../../application';
import { HttpWorkOrderRepository } from '../http/http-work-order-repository';
import { MockWorkOrderRepository } from '../mock/mock-work-order-repository';

export function provideWorkOrderDataAccess(): Provider {
  return {
    provide: WorkOrderRepositoryPort,
    useFactory: (runtimeConfig: AppRuntimeConfig, http: HttpClient) => runtimeConfig.dataAccess.workOrders === 'http' ? new HttpWorkOrderRepository(http, runtimeConfig) : new MockWorkOrderRepository(),
    deps: [APP_RUNTIME_CONFIG, HttpClient],
  };
}
