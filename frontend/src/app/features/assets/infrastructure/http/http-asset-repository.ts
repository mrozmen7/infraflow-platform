import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { getAsset } from '../../../../core/api/generated/fn/assets/get-asset';
import { searchAssets } from '../../../../core/api/generated/fn/assets/search-assets';
import type { AssetResponse } from '../../../../core/api/generated/models/asset-response';
import { requireResponseFields } from '../../../../core/api/require-response-fields';
import type { AppRuntimeConfig } from '../../../../core/config/app-runtime-config';
import type { AssetRepositoryPort } from '../../application';
import type { Asset } from '../../domain/asset';

const ASSET_REQUIRED_FIELDS = [
  'id',
  'name',
  'type',
  'location',
  'criticality',
  'status',
  'lastInspectedAt',
] as const;

export class HttpAssetRepository implements AssetRepositoryPort {
  constructor(
    private readonly http: HttpClient,
    private readonly runtimeConfig: AppRuntimeConfig,
  ) {}

  async search(searchTerm: string): Promise<readonly Asset[]> {
    const response = await firstValueFrom(
      searchAssets(this.http, this.rootUrl(), { searchTerm }),
    );

    return (response.body ?? []).map((asset) => toAsset(asset));
  }

  async findById(assetId: string): Promise<Asset | undefined> {
    const response = await firstValueFrom(getAsset(this.http, this.rootUrl(), { assetId }));

    return toAsset(response.body);
  }

  private rootUrl(): string {
    // Generated operation paths are contract-absolute (`/api/v1/...`); the
    // runtime config only contributes an optional origin prefix before `/api`.
    return this.runtimeConfig.apiBaseUrl.replace(/\/api$/, '');
  }
}

function toAsset(response: AssetResponse): Asset {
  requireResponseFields(response, ASSET_REQUIRED_FIELDS, 'AssetResponse');

  return {
    id: response.id!,
    name: response.name!,
    type: response.type!,
    location: response.location!,
    criticality: response.criticality!,
    status: response.status!,
    lastInspectedAt: response.lastInspectedAt!,
  };
}
