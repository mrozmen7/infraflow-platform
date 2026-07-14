import type { Provider } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { APP_RUNTIME_CONFIG, type AppRuntimeConfig } from '../../../../core/config/app-runtime-config';
import { AssetRepositoryPort } from '../../application';
import { HttpAssetRepository } from '../http/http-asset-repository';
import { MockAssetRepository } from '../mock/mock-asset-repository';

export function provideAssetDataAccess(): Provider {
  return {
    provide: AssetRepositoryPort,
    useFactory: (runtimeConfig: AppRuntimeConfig, http: HttpClient) =>
      runtimeConfig.dataAccess.assets === 'http'
        ? new HttpAssetRepository(http, runtimeConfig)
        : new MockAssetRepository(),
    deps: [APP_RUNTIME_CONFIG, HttpClient],
  };
}
