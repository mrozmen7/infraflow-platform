package com.infraflow.platform.shared.audit;

import java.time.Clock;
import java.time.OffsetDateTime;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuditLogService {

  private final SpringDataAuditEventRepository auditEventRepository;
  private final Clock clock;

  public AuditLogService(SpringDataAuditEventRepository auditEventRepository, Clock clock) {
    this.auditEventRepository = auditEventRepository;
    this.clock = clock;
  }

  @Transactional(propagation = Propagation.REQUIRES_NEW)
  public void record(
    String actor,
    String action,
    String targetType,
    String targetId,
    AuditOutcome outcome,
    String message
  ) {
    auditEventRepository.save(new AuditEventJpaEntity(
      OffsetDateTime.now(clock),
      actor,
      action,
      targetType,
      targetId,
      outcome,
      message
    ));
  }
}

