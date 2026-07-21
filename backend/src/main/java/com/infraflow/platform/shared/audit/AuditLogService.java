package com.infraflow.platform.shared.audit;

import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.MeterRegistry;
import java.time.Clock;
import java.time.OffsetDateTime;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuditLogService {

  private final SpringDataAuditEventRepository auditEventRepository;
  private final Clock clock;
  private final MeterRegistry meterRegistry;

  public AuditLogService(
    SpringDataAuditEventRepository auditEventRepository,
    Clock clock,
    MeterRegistry meterRegistry
  ) {
    this.auditEventRepository = auditEventRepository;
    this.clock = clock;
    this.meterRegistry = meterRegistry;
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

    Counter
      .builder("infraflow.audit.events")
      .description("Audit events recorded by outcome")
      .tag("action", action)
      .tag("outcome", outcome.name())
      .register(meterRegistry)
      .increment();
  }
}
