package com.infraflow.platform.workorders.infrastructure;

import com.infraflow.platform.shared.kernel.IncidentId;
import com.infraflow.platform.workorders.domain.WorkOrder;
import com.infraflow.platform.workorders.domain.WorkOrderId;

final class WorkOrderPersistenceMapper {

  private WorkOrderPersistenceMapper() {
  }

  static WorkOrder toDomain(WorkOrderJpaEntity entity) {
    return new WorkOrder(
      new WorkOrderId(entity.id()),
      new IncidentId(entity.incidentId()),
      entity.title(),
      entity.description(),
      entity.assetId(),
      entity.location(),
      entity.priority(),
      entity.status(),
      entity.createdAt()
    );
  }

  static WorkOrderJpaEntity toEntity(WorkOrder workOrder) {
    return new WorkOrderJpaEntity(
      workOrder.id().value(),
      workOrder.incidentId().value(),
      workOrder.title(),
      workOrder.description(),
      workOrder.assetId(),
      workOrder.location(),
      workOrder.priority(),
      workOrder.status(),
      workOrder.createdAt()
    );
  }
}
