import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import type { AppRuntimeConfig } from '../../../../core/config/app-runtime-config';
import type { WorkOrderRepositoryPort } from '../../application';
import type { WorkOrder } from '../../domain/work-order';

export class HttpWorkOrderRepository implements WorkOrderRepositoryPort {
  constructor(
    private readonly http: HttpClient,
    private readonly runtimeConfig: AppRuntimeConfig,
  ) {}

  findAll(): Promise<readonly WorkOrder[]> {
    return firstValueFrom(this.http.get<readonly WorkOrder[]>(this.workOrdersUrl()));
  }

  findById(workOrderId: string): Promise<WorkOrder | undefined> {
    return firstValueFrom(this.http.get<WorkOrder>(`${this.workOrdersUrl()}/${workOrderId}`));
  }

  draftFromIncident(incidentId: string): Promise<WorkOrder> {
    return firstValueFrom(this.http.post<WorkOrder>(`${this.workOrdersUrl()}/drafts`, { incidentId }));
  }

  moveToReady(workOrderId: string): Promise<WorkOrder> {
    return this.workflow(workOrderId, 'ready');
  }

  start(workOrderId: string): Promise<WorkOrder> {
    return this.workflow(workOrderId, 'start');
  }

  complete(workOrderId: string): Promise<WorkOrder> {
    return this.workflow(workOrderId, 'complete');
  }

  private workflow(workOrderId: string, action: 'ready' | 'start' | 'complete'): Promise<WorkOrder> {
    return firstValueFrom(this.http.post<{ readonly workOrder: WorkOrder }>(
      `${this.workOrdersUrl()}/${workOrderId}/${action}`, {},
    )).then((response) => response.workOrder);
  }

  private workOrdersUrl(): string {
    return `${this.runtimeConfig.apiBaseUrl}/v1/work-orders`;
  }
}
