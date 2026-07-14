package com.infraflow.platform.workorders.application;

import com.infraflow.platform.workorders.domain.WorkOrder;
import com.infraflow.platform.workorders.domain.WorkOrderId;
import java.util.List;
import java.util.Optional;

public interface WorkOrderRepository {

  List<WorkOrder> findAll();

  Optional<WorkOrder> findById(WorkOrderId workOrderId);

  Optional<WorkOrder> findByIncidentId(String incidentId);

  WorkOrder save(WorkOrder workOrder);

  WorkOrderId nextIdentity();
}
