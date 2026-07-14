import type { WorkOrder } from '../../domain/work-order';

export abstract class WorkOrderRepositoryPort {
  abstract findAll(abortSignal?: AbortSignal): Promise<readonly WorkOrder[]>;
  abstract findById(workOrderId: string, abortSignal?: AbortSignal): Promise<WorkOrder | undefined>;
  abstract draftFromIncident(incidentId: string): Promise<WorkOrder>;
  abstract moveToReady(workOrderId: string): Promise<WorkOrder>;
  abstract start(workOrderId: string): Promise<WorkOrder>;
  abstract complete(workOrderId: string): Promise<WorkOrder>;
}
