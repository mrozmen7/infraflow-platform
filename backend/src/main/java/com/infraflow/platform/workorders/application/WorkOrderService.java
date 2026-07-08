package com.infraflow.platform.workorders.application;

import com.infraflow.platform.incidents.application.IncidentLookupPort;
import com.infraflow.platform.incidents.application.IncidentSummaryForWorkOrder;
import com.infraflow.platform.shared.error.ResourceNotFoundException;
import com.infraflow.platform.workorders.domain.WorkOrder;
import com.infraflow.platform.workorders.domain.WorkOrderId;
import com.infraflow.platform.workorders.domain.WorkOrderStatus;
import java.time.Clock;
import java.time.OffsetDateTime;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class WorkOrderService {

  private final WorkOrderRepository workOrderRepository;
  private final IncidentLookupPort incidentLookupPort;
  private final Clock clock;

  public WorkOrderService(
    WorkOrderRepository workOrderRepository,
    IncidentLookupPort incidentLookupPort,
    Clock clock
  ) {
    this.workOrderRepository = workOrderRepository;
    this.incidentLookupPort = incidentLookupPort;
    this.clock = clock;
  }

  @Transactional(readOnly = true)
  public List<WorkOrder> findAll() {
    return workOrderRepository.findAll();
  }

  @Transactional(readOnly = true)
  public WorkOrder get(WorkOrderId workOrderId) {
    return workOrderRepository.findById(workOrderId)
      .orElseThrow(() -> new ResourceNotFoundException(
        "Work order %s was not found.".formatted(workOrderId)
      ));
  }

  public WorkOrder draftFromIncident(DraftWorkOrderCommand command) {
    IncidentSummaryForWorkOrder incident = incidentLookupPort.getIncidentForWorkOrder(command.incidentId());
    WorkOrder workOrder = new WorkOrder(
      workOrderRepository.nextIdentity(),
      incident.incidentId(),
      "Draft response for " + incident.title(),
      incident.description(),
      incident.assetId(),
      incident.location(),
      incident.priority(),
      WorkOrderStatus.DRAFT,
      OffsetDateTime.now(clock)
    );

    return workOrderRepository.save(workOrder);
  }
}
