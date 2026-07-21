import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { completeWorkOrder } from '../../../../core/api/generated/fn/work-orders/complete-work-order';
import { draftWorkOrder } from '../../../../core/api/generated/fn/work-orders/draft-work-order';
import { getWorkOrder } from '../../../../core/api/generated/fn/work-orders/get-work-order';
import { listWorkOrders } from '../../../../core/api/generated/fn/work-orders/list-work-orders';
import { moveWorkOrderToReady } from '../../../../core/api/generated/fn/work-orders/move-work-order-to-ready';
import { startWorkOrder } from '../../../../core/api/generated/fn/work-orders/start-work-order';
import type { WorkOrderResponse } from '../../../../core/api/generated/models/work-order-response';
import { requireResponseFields } from '../../../../core/api/require-response-fields';
import type { AppRuntimeConfig } from '../../../../core/config/app-runtime-config';
import type { WorkOrderRepositoryPort } from '../../application';
import type { WorkOrder } from '../../domain/work-order';

const WORK_ORDER_REQUIRED_FIELDS = [
  'id',
  'incidentId',
  'title',
  'description',
  'assetId',
  'location',
  'priority',
  'status',
  'createdAt',
] as const;

export class HttpWorkOrderRepository implements WorkOrderRepositoryPort {
  constructor(
    private readonly http: HttpClient,
    private readonly runtimeConfig: AppRuntimeConfig,
  ) {}

  async findAll(): Promise<readonly WorkOrder[]> {
    const response = await firstValueFrom(listWorkOrders(this.http, this.rootUrl()));

    return (response.body ?? []).map((workOrder) => toWorkOrder(workOrder));
  }

  async findById(workOrderId: string): Promise<WorkOrder | undefined> {
    const response = await firstValueFrom(getWorkOrder(this.http, this.rootUrl(), { workOrderId }));

    return toWorkOrder(response.body);
  }

  draftFromIncident(incidentId: string): Promise<WorkOrder> {
    return firstValueFrom(
      draftWorkOrder(this.http, this.rootUrl(), { body: { incidentId } }),
    ).then((response) => toWorkOrder(response.body));
  }

  moveToReady(workOrderId: string): Promise<WorkOrder> {
    return firstValueFrom(
      moveWorkOrderToReady(this.http, this.rootUrl(), { workOrderId }),
    ).then((response) => toWorkflowWorkOrder(response.body.workOrder, workOrderId));
  }

  start(workOrderId: string): Promise<WorkOrder> {
    return firstValueFrom(
      startWorkOrder(this.http, this.rootUrl(), { workOrderId }),
    ).then((response) => toWorkflowWorkOrder(response.body.workOrder, workOrderId));
  }

  complete(workOrderId: string): Promise<WorkOrder> {
    return firstValueFrom(
      completeWorkOrder(this.http, this.rootUrl(), { workOrderId }),
    ).then((response) => toWorkflowWorkOrder(response.body.workOrder, workOrderId));
  }

  private rootUrl(): string {
    // Generated operation paths are contract-absolute (`/api/v1/...`); the
    // runtime config only contributes an optional origin prefix before `/api`.
    return this.runtimeConfig.apiBaseUrl.replace(/\/api$/, '');
  }
}

function toWorkflowWorkOrder(
  workOrder: WorkOrderResponse | undefined,
  workOrderId: string,
): WorkOrder {
  if (!workOrder) {
    throw new Error(`WorkOrderWorkflowResponse for "${workOrderId}" is missing the work order.`);
  }

  return toWorkOrder(workOrder);
}

function toWorkOrder(response: WorkOrderResponse): WorkOrder {
  requireResponseFields(response, WORK_ORDER_REQUIRED_FIELDS, 'WorkOrderResponse');

  return {
    id: response.id!,
    incidentId: response.incidentId!,
    title: response.title!,
    description: response.description!,
    assetId: response.assetId!,
    location: response.location!,
    priority: response.priority!,
    status: response.status!,
    createdAt: response.createdAt!,
  };
}
