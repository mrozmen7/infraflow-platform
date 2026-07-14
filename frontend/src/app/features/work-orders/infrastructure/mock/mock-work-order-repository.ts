import type { WorkOrderRepositoryPort } from '../../application';
import type { WorkOrder } from '../../domain/work-order';

export class MockWorkOrderRepository implements WorkOrderRepositoryPort {
  private workOrders: WorkOrder[] = [{ id: 'WO-2026-0001', incidentId: 'INC-2026-0003', title: 'Verify emergency phone inspection', description: 'Confirm scheduled functional check with the field team.', assetId: 'TEL-ST-012', location: 'South Tunnel · Bay 12', priority: 'P3', status: 'Draft', createdAt: '2026-06-29T08:15:00.000Z' }];

  async findAll(): Promise<readonly WorkOrder[]> { return this.workOrders; }
  async findById(workOrderId: string): Promise<WorkOrder | undefined> { return this.workOrders.find((workOrder) => workOrder.id === workOrderId); }
  async draftFromIncident(incidentId: string): Promise<WorkOrder> {
    const workOrder: WorkOrder = { id: `WO-2026-${String(this.workOrders.length + 1).padStart(4, '0')}`, incidentId, title: `Draft response for ${incidentId}`, description: 'Controlled maintenance response draft.', assetId: 'TRF-NT-003', location: 'North Tunnel · KM 3.0', priority: 'P1', status: 'Draft', createdAt: new Date().toISOString() };
    this.workOrders = [workOrder, ...this.workOrders];
    return workOrder;
  }
  async moveToReady(workOrderId: string): Promise<WorkOrder> { return this.move(workOrderId, 'Draft', 'Ready'); }
  async start(workOrderId: string): Promise<WorkOrder> { return this.move(workOrderId, 'Ready', 'In Progress'); }
  async complete(workOrderId: string): Promise<WorkOrder> { return this.move(workOrderId, 'In Progress', 'Done'); }
  private move(workOrderId: string, expected: WorkOrder['status'], status: WorkOrder['status']): WorkOrder {
    const index = this.workOrders.findIndex((workOrder) => workOrder.id === workOrderId);
    if (index < 0 || this.workOrders[index].status !== expected) throw new Error('Workflow transition is not allowed.');
    const updated = { ...this.workOrders[index], status } as WorkOrder;
    this.workOrders = this.workOrders.map((workOrder, candidateIndex) => candidateIndex === index ? updated : workOrder);
    return updated;
  }
}
