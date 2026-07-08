package com.infraflow.platform.workorders.infrastructure;

import com.infraflow.platform.workorders.application.WorkOrderRepository;
import com.infraflow.platform.workorders.domain.WorkOrder;
import com.infraflow.platform.workorders.domain.WorkOrderId;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicInteger;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Repository;

@Repository
@Profile("!inmemory")
class JpaWorkOrderRepository implements WorkOrderRepository {

  private final SpringDataWorkOrderJpaRepository springDataRepository;
  private final AtomicInteger sequence = new AtomicInteger(2);

  JpaWorkOrderRepository(SpringDataWorkOrderJpaRepository springDataRepository) {
    this.springDataRepository = springDataRepository;
  }

  @Override
  public List<WorkOrder> findAll() {
    return springDataRepository.findAllByOrderByCreatedAtDesc().stream()
      .map(WorkOrderPersistenceMapper::toDomain)
      .toList();
  }

  @Override
  public Optional<WorkOrder> findById(WorkOrderId workOrderId) {
    return springDataRepository.findById(workOrderId.value())
      .map(WorkOrderPersistenceMapper::toDomain);
  }

  @Override
  public WorkOrder save(WorkOrder workOrder) {
    WorkOrderJpaEntity entity = springDataRepository.save(WorkOrderPersistenceMapper.toEntity(workOrder));
    return WorkOrderPersistenceMapper.toDomain(entity);
  }

  @Override
  public WorkOrderId nextIdentity() {
    return new WorkOrderId("WO-%d-%04d".formatted(OffsetDateTime.now().getYear(), sequence.getAndIncrement()));
  }
}
