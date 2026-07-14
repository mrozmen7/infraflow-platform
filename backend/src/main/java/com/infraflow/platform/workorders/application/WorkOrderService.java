package com.infraflow.platform.workorders.application;

import com.infraflow.platform.incidents.application.IncidentLookupPort;
import com.infraflow.platform.incidents.application.IncidentSummaryForWorkOrder;
import com.infraflow.platform.shared.error.ResourceNotFoundException;
import com.infraflow.platform.shared.audit.AuditLogService;
import com.infraflow.platform.shared.audit.AuditOutcome;
import com.infraflow.platform.shared.security.CurrentActorProvider;
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
  private final AuditLogService auditLogService;
  private final CurrentActorProvider currentActorProvider;

  public WorkOrderService(
    WorkOrderRepository workOrderRepository,
    IncidentLookupPort incidentLookupPort,
    Clock clock,
    AuditLogService auditLogService,
    CurrentActorProvider currentActorProvider
  ) {
    this.workOrderRepository = workOrderRepository;
    this.incidentLookupPort = incidentLookupPort;
    this.clock = clock;
    this.auditLogService = auditLogService;
    this.currentActorProvider = currentActorProvider;
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

  public DraftWorkOrderResult draftFromIncident(DraftWorkOrderCommand command) {
    WorkOrder existing = workOrderRepository.findByIncidentId(command.incidentId().value())
      .orElse(null);
    if (existing != null) {
      record("WORK_ORDER_DRAFT_REUSED", existing, AuditOutcome.SUCCESS,
        "Repeated draft request returned the existing controlled work order.");
      return new DraftWorkOrderResult(existing, false);
    }

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

    WorkOrder saved = workOrderRepository.save(workOrder);
    record("WORK_ORDER_DRAFT_CREATED", saved, AuditOutcome.SUCCESS,
      "Controlled draft created from incident context.");
    return new DraftWorkOrderResult(saved, true);
  }

  public WorkOrder moveToReady(WorkOrderId workOrderId) {
    return transition(workOrderId, WorkOrderStatus.READY, "WORK_ORDER_READY");
  }

  public WorkOrder start(WorkOrderId workOrderId) {
    return transition(workOrderId, WorkOrderStatus.IN_PROGRESS, "WORK_ORDER_STARTED");
  }

  public WorkOrder complete(WorkOrderId workOrderId) {
    return transition(workOrderId, WorkOrderStatus.DONE, "WORK_ORDER_COMPLETED");
  }

  private WorkOrder transition(WorkOrderId workOrderId, WorkOrderStatus nextStatus, String auditAction) {
    WorkOrder current = get(workOrderId);
    try {
      WorkOrder saved = workOrderRepository.save(current.moveTo(nextStatus));
      record(auditAction, saved, AuditOutcome.SUCCESS,
        "Workflow moved to %s.".formatted(nextStatus.apiValue()));
      return saved;
    } catch (RuntimeException exception) {
      record(auditAction, current, AuditOutcome.REJECTED, exception.getMessage());
      throw exception;
    }
  }

  private void record(String action, WorkOrder workOrder, AuditOutcome outcome, String message) {
    auditLogService.record(
      currentActorProvider.currentActor(), action, "WORK_ORDER", workOrder.id().value(), outcome, message
    );
  }
}
