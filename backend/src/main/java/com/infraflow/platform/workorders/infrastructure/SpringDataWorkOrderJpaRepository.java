package com.infraflow.platform.workorders.infrastructure;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

interface SpringDataWorkOrderJpaRepository extends JpaRepository<WorkOrderJpaEntity, String> {

  List<WorkOrderJpaEntity> findAllByOrderByCreatedAtDesc();
}
