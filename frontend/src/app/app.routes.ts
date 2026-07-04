import { Routes } from '@angular/router';

import { provideIncidentDataAccess } from './features/incidents/data-access/provide-incident-data-access';
import { incidentsFeatureGuard } from './features/incidents/guards/incidents-feature.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'incidents',
  },
  {
    path: 'incidents',
    canMatch: [incidentsFeatureGuard],
    providers: [provideIncidentDataAccess()],
    loadChildren: () =>
      import('./features/incidents/incidents.routes').then((module) => module.INCIDENT_ROUTES),
  },
  {
    path: 'assets',
    title: 'Assets · InfraFlow',
    loadComponent: () =>
      import('./features/assets/assets-page').then((module) => module.AssetsPage),
  },
  {
    path: 'work-orders',
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
