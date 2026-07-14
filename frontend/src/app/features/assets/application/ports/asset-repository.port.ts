import type { Asset } from '../../domain/asset';

export abstract class AssetRepositoryPort {
  abstract search(searchTerm: string, abortSignal?: AbortSignal): Promise<readonly Asset[]>;
  abstract findById(assetId: string, abortSignal?: AbortSignal): Promise<Asset | undefined>;
}
