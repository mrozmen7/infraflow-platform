package com.infraflow.platform.workorders.infrastructure;

import com.infraflow.platform.shared.kernel.IncidentId;
import com.infraflow.platform.shared.kernel.IncidentPriority;
import com.infraflow.platform.workorders.application.WorkOrderRepository;
import com.infraflow.platform.workorders.domain.WorkOrder;
import com.infraflow.platform.workorders.domain.WorkOrderId;
import com.infraflow.platform.workorders.domain.WorkOrderStatus;
import java.time.OffsetDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Repository;

@Repository
@Profile("inmemory")
class InMemoryWorkOrderRepository implements WorkOrderRepository {

  private final Map<WorkOrderId, WorkOrder> workOrders = new ConcurrentHashMap<>();
  private final AtomicInteger sequence = new AtomicInteger(2);

  InMemoryWorkOrderRepository() {
    seed();
  }

  @Override
  public List<WorkOrder> findAll() {
    return workOrders.values().stream()
      .sorted(Comparator.comparing(WorkOrder::createdAt).reversed())
      .toList();
  }

  @Override
  public Optional<WorkOrder> findById(WorkOrderId workOrderId) {
    return Optional.ofNullable(workOrders.get(workOrderId));
  }

  @Override
  public Optional<WorkOrder> findByIncidentId(String incidentId) {
    return workOrders.values().stream()
      .filter(workOrder -> workOrder.incidentId().value().equals(incidentId))
      .findFirst();
  }

  @Override
  public WorkOrder save(WorkOrder workOrder) {
    workOrders.put(workOrder.id(), workOrder);
    return workOrder;
  }

  @Override
  public WorkOrderId nextIdentity() {
    return new WorkOrderId("WO-%d-%04d".formatted(OffsetDateTime.now().getYear(), sequence.getAndIncrement()));
  }

  private void seed() {
    save(new WorkOrder(
      new WorkOrderId("WO-2026-0001"),
      new IncidentId("INC-2026-0003"),
      "Verify emergency phone inspection",
      "Confirm scheduled functional check with the field team.",
      "TEL-ST-012",
      "South Tunnel · Bay 12",
      IncidentPriority.P3,
      WorkOrderStatus.DRAFT,
      OffsetDateTime.parse("2026-06-29T08:15:00Z")
    ));
  }
}
