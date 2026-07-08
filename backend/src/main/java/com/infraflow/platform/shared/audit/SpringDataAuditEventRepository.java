package com.infraflow.platform.shared.audit;

import org.springframework.data.jpa.repository.JpaRepository;

interface SpringDataAuditEventRepository extends JpaRepository<AuditEventJpaEntity, Long> {
}

