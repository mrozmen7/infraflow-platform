import { inject } from '@angular/core';
import { RedirectCommand, type ResolveFn, Router } from '@angular/router';

import { WorkOrderRepositoryPort } from '../application';
import type { WorkOrder } from '../domain/work-order';

export const workOrderResolver: ResolveFn<WorkOrder | RedirectCommand> = async (route) => {
  const workOrderId = route.paramMap.get('workOrderId');
  const repository = inject(WorkOrderRepositoryPort);
  const router = inject(Router);
  if (!workOrderId) { return new RedirectCommand(router.parseUrl('/work-orders')); }
  const workOrder = await repository.findById(workOrderId);
  return workOrder ?? new RedirectCommand(router.parseUrl('/work-orders'));
};
