package com.infraflow.platform.workorders.infrastructure;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

interface SpringDataWorkOrderJpaRepository extends JpaRepository<WorkOrderJpaEntity, String> {

  List<WorkOrderJpaEntity> findAllByOrderByCreatedAtDesc();

  Optional<WorkOrderJpaEntity> findByIncidentId(String incidentId);

  @Query(value = "select nextval('work_order_number_sequence')", nativeQuery = true)
  long nextWorkOrderNumber();
}
