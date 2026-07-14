import type { Routes } from '@angular/router';

import { assetResolver } from './resolvers/asset.resolver';

export const ASSET_ROUTES: Routes = [
  { path: '', title: 'Asset registry · InfraFlow', loadComponent: () => import('./pages/asset-list-page/asset-list-page').then((module) => module.AssetListPage) },
  { path: ':assetId', title: 'Asset detail · InfraFlow', resolve: { asset: assetResolver }, loadComponent: () => import('./pages/asset-detail-page/asset-detail-page').then((module) => module.AssetDetailPage) },
];
