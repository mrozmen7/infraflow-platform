package com.infraflow.platform.workorders.infrastructure;

import com.infraflow.platform.incidents.domain.IncidentPriority;
import com.infraflow.platform.workorders.domain.WorkOrderStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.OffsetDateTime;

@Entity
@Table(name = "work_orders")
class WorkOrderJpaEntity {

  @Id
  @Column(name = "id", nullable = false, length = 16)
  private String id;

  @Column(name = "incident_id", nullable = false, length = 16)
  private String incidentId;

  @Column(name = "title", nullable = false, length = 180)
  private String title;

  @Column(name = "description", nullable = false, length = 1_000)
  private String description;

  @Column(name = "asset_id", nullable = false, length = 40)
  private String assetId;

  @Column(name = "location", nullable = false, length = 160)
  private String location;

  @Enumerated(EnumType.STRING)
  @Column(name = "priority", nullable = false, length = 10)
  private IncidentPriority priority;

  @Enumerated(EnumType.STRING)
  @Column(name = "status", nullable = false, length = 30)
  private WorkOrderStatus status;

  @Column(name = "created_at", nullable = false)
  private OffsetDateTime createdAt;

  protected WorkOrderJpaEntity() {
  }

  WorkOrderJpaEntity(
    String id,
    String incidentId,
    String title,
    String description,
    String assetId,
    String location,
    IncidentPriority priority,
    WorkOrderStatus status,
    OffsetDateTime createdAt
  ) {
    this.id = id;
    this.incidentId = incidentId;
    this.title = title;
    this.description = description;
    this.assetId = assetId;
    this.location = location;
    this.priority = priority;
    this.status = status;
    this.createdAt = createdAt;
  }

  String id() {
    return id;
  }

  String incidentId() {
    return incidentId;
  }

  String title() {
    return title;
  }

  String description() {
    return description;
  }

  String assetId() {
    return assetId;
  }

  String location() {
    return location;
  }

  IncidentPriority priority() {
    return priority;
  }

  WorkOrderStatus status() {
    return status;
  }

  OffsetDateTime createdAt() {
    return createdAt;
  }
}
