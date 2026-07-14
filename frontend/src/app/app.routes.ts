import { Routes } from '@angular/router';

import {
  incidentsFeatureGuard,
  provideIncidentDataAccess,
  provideIncidentStore,
} from './features/incidents/public-api';
import { authenticationGuard } from './core/auth/authentication.guard';
import { provideAssetDataAccess } from './features/assets/public-api';
import { provideWorkOrderDataAccess } from './features/work-orders/public-api';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'incidents',
  },
  {
    path: 'login',
    title: 'Sign in · InfraFlow',
    loadComponent: () =>
      import('./features/auth/login-page/login-page').then((module) => module.LoginPage),
  },
  {
    path: 'incidents',
    canMatch: [authenticationGuard, incidentsFeatureGuard],
    providers: [provideIncidentDataAccess(), provideIncidentStore()],
    loadChildren: () =>
      import('./features/incidents/incidents.routes').then((module) => module.INCIDENT_ROUTES),
  },
  {
    path: 'assets',
    canMatch: [authenticationGuard],
    providers: [provideAssetDataAccess()],
    loadChildren: () =>
      import('./features/assets/assets.routes').then((module) => module.ASSET_ROUTES),
  },
  {
    path: 'work-orders',
    canMatch: [authenticationGuard],
    providers: [provideWorkOrderDataAccess()],
    loadChildren: () =>
      import('./features/work-orders/work-orders.routes').then((module) => module.WORK_ORDER_ROUTES),
  },
  {
    path: 'feature-unavailable',
    title: 'Feature unavailable · InfraFlow',
    loadComponent: () =>
      import('./core/ui/feature-unavailable-page').then((module) => module.FeatureUnavailablePage),
  },
  {
    path: 'not-found',
    title: 'Not found · InfraFlow',
    loadComponent: () => import('./core/ui/not-found-page').then((module) => module.NotFoundPage),
  },
  {
    path: '**',
    redirectTo: 'not-found',
  },
];
