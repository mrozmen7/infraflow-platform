import { inject } from '@angular/core';
import { RedirectCommand, type ResolveFn, Router } from '@angular/router';

import { AssetRepositoryPort } from '../application';
import type { Asset } from '../domain/asset';

export const assetResolver: ResolveFn<Asset | RedirectCommand> = async (route) => {
  const assetId = route.paramMap.get('assetId');
  const repository = inject(AssetRepositoryPort);
  const router = inject(Router);

  if (!assetId) {
    return new RedirectCommand(router.parseUrl('/assets'));
  }

  const asset = await repository.findById(assetId);
  return asset ?? new RedirectCommand(router.parseUrl('/assets'));
};
