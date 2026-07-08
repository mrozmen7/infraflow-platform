package com.infraflow.platform.workorders.web;

import com.infraflow.platform.incidents.domain.IncidentPriority;
import com.infraflow.platform.workorders.domain.WorkOrder;
import com.infraflow.platform.workorders.domain.WorkOrderStatus;
import java.time.OffsetDateTime;

public record WorkOrderResponse(
  String id,
  String incidentId,
  String title,
  String description,
  String assetId,
  String location,
  IncidentPriority priority,
  WorkOrderStatus status,
  OffsetDateTime createdAt
) {

  static WorkOrderResponse from(WorkOrder workOrder) {
    return new WorkOrderResponse(
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
