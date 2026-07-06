import { Routes } from '@angular/router';

import { incidentResolver } from './resolvers/incident.resolver';

export const INCIDENT_ROUTES: Routes = [
  {
    path: '',
    title: 'Incident workspace · InfraFlow',
    loadComponent: () =>
      import('./pages/incident-list-page/incident-list-page').then(
        (module) => module.IncidentListPage,
      ),
  },
  {
    path: 'new',
    title: 'Report incident · InfraFlow',
    loadComponent: () =>
      import('./pages/incident-create-page/incident-create-page').then(
        (module) => module.IncidentCreatePage,
      ),
  },
  {
    path: ':incidentId',
    title: 'Incident detail · InfraFlow',
    resolve: {
      incident: incidentResolver,
    },
    loadComponent: () =>
      import('./pages/incident-detail-page/incident-detail-page').then(
        (module) => module.IncidentDetailPage,
      ),
  },
];
