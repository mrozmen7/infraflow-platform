export const workOrderStatuses = ['Draft', 'Ready', 'In Progress', 'Done'] as const;
export type WorkOrderStatus = (typeof workOrderStatuses)[number];
export type WorkOrderPriority = 'P1' | 'P2' | 'P3' | 'P4';

export interface WorkOrder {
  readonly id: string;
  readonly incidentId: string;
  readonly title: string;
  readonly description: string;
  readonly assetId: string;
  readonly location: string;
  readonly priority: WorkOrderPriority;
  readonly status: WorkOrderStatus;
  readonly createdAt: string;
}
