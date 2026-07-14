import type { Routes } from '@angular/router';
import { workOrderResolver } from './resolvers/work-order.resolver';

export const WORK_ORDER_ROUTES: Routes = [
  { path: '', title: 'Work orders · InfraFlow', loadComponent: () => import('./pages/work-order-list-page/work-order-list-page').then((module) => module.WorkOrderListPage) },
  { path: ':workOrderId', title: 'Work order detail · InfraFlow', resolve: { workOrder: workOrderResolver }, loadComponent: () => import('./pages/work-order-detail-page/work-order-detail-page').then((module) => module.WorkOrderDetailPage) },
];
