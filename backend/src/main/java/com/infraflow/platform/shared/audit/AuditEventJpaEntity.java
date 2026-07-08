package com.infraflow.platform.shared.audit;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.OffsetDateTime;

@Entity
@Table(name = "audit_events")
class AuditEventJpaEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "occurred_at", nullable = false)
  private OffsetDateTime occurredAt;

  @Column(name = "actor", nullable = false, length = 120)
  private String actor;

  @Column(name = "action", nullable = false, length = 80)
  private String action;

  @Column(name = "target_type", nullable = false, length = 80)
  private String targetType;

  @Column(name = "target_id", nullable = false, length = 80)
  private String targetId;

  @Enumerated(EnumType.STRING)
  @Column(name = "outcome", nullable = false, length = 40)
  private AuditOutcome outcome;

  @Column(name = "message", nullable = false, length = 1_000)
  private String message;

  protected AuditEventJpaEntity() {
  }

  AuditEventJpaEntity(
    OffsetDateTime occurredAt,
    String actor,
    String action,
    String targetType,
    String targetId,
    AuditOutcome outcome,
    String message
  ) {
    this.occurredAt = occurredAt;
    this.actor = actor;
    this.action = action;
    this.targetType = targetType;
    this.targetId = targetId;
    this.outcome = outcome;
    this.message = message;
  }
}

