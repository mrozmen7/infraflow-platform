import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import type { AppRuntimeConfig } from '../../../../core/config/app-runtime-config';
import type { AssetRepositoryPort } from '../../application';
import type { Asset } from '../../domain/asset';

export class HttpAssetRepository implements AssetRepositoryPort {
  constructor(
    private readonly http: HttpClient,
    private readonly runtimeConfig: AppRuntimeConfig,
  ) {}

  search(searchTerm: string): Promise<readonly Asset[]> {
    return firstValueFrom(
      this.http.get<readonly Asset[]>(this.assetsUrl(), {
        params: new HttpParams().set('searchTerm', searchTerm),
      }),
    );
  }

  findById(assetId: string): Promise<Asset | undefined> {
    return firstValueFrom(this.http.get<Asset>(`${this.assetsUrl()}/${assetId}`));
  }

  private assetsUrl(): string {
    return `${this.runtimeConfig.apiBaseUrl}/v1/assets`;
  }
}
