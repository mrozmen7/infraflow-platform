import { Routes } from '@angular/router';

import {
  incidentsFeatureGuard,
  provideIncidentDataAccess,
  provideIncidentStore,
} from './features/incidents/public-api';
import { authenticationGuard } from './core/auth/authentication.guard';

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
    title: 'Assets · InfraFlow',
    loadComponent: () =>
      import('./features/assets/assets-page').then((module) => module.AssetsPage),
  },
  {
    path: 'work-orders',
    canMatch: [authenticationGuard],
    title: 'Work orders · InfraFlow',
    loadComponent: () =>
      import('./features/work-orders/work-orders-page').then((module) => module.WorkOrdersPage),
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
