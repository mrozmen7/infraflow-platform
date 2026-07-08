package com.infraflow.platform.incidents.infrastructure;

import com.infraflow.platform.incidents.domain.IncidentPriority;
import com.infraflow.platform.incidents.domain.IncidentSeverity;
import com.infraflow.platform.incidents.domain.IncidentStatus;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OrderColumn;
import jakarta.persistence.Table;
import jakarta.persistence.Version;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "incidents")
class IncidentJpaEntity {

  @Id
  @Column(name = "id", nullable = false, length = 16)
  private String id;

  @Column(name = "title", nullable = false, length = 120)
  private String title;

  @Column(name = "description", nullable = false, length = 1_000)
  private String description;

  @Column(name = "location", nullable = false, length = 160)
  private String location;

  @Column(name = "asset_id", nullable = false, length = 40)
  private String assetId;

  @Column(name = "reported_at", nullable = false)
  private OffsetDateTime reportedAt;

  @Enumerated(EnumType.STRING)
  @Column(name = "severity", nullable = false, length = 20)
  private IncidentSeverity severity;

  @Enumerated(EnumType.STRING)
  @Column(name = "priority", nullable = false, length = 10)
  private IncidentPriority priority;

  @Enumerated(EnumType.STRING)
  @Column(name = "status", nullable = false, length = 30)
  private IncidentStatus status;

  @ElementCollection(fetch = FetchType.EAGER)
  @CollectionTable(
    name = "incident_operational_signals",
    joinColumns = @JoinColumn(name = "incident_id")
  )
  @OrderColumn(name = "signal_order")
  @Column(name = "signal", nullable = false, length = 120)
  private List<String> operationalSignals = new ArrayList<>();

  @Version
  @Column(name = "version")
  private Long version;

  protected IncidentJpaEntity() {
  }

  IncidentJpaEntity(
    String id,
    String title,
    String description,
    String location,
    String assetId,
    OffsetDateTime reportedAt,
    IncidentSeverity severity,
    IncidentPriority priority,
    IncidentStatus status,
    List<String> operationalSignals,
    Long version
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.location = location;
    this.assetId = assetId;
    this.reportedAt = reportedAt;
    this.severity = severity;
    this.priority = priority;
    this.status = status;
    this.operationalSignals = new ArrayList<>(operationalSignals);
    this.version = version;
  }

  String id() {
    return id;
  }

  String title() {
    return title;
  }

  String description() {
    return description;
  }

  String location() {
    return location;
  }

  String assetId() {
    return assetId;
  }

  OffsetDateTime reportedAt() {
    return reportedAt;
  }

  IncidentSeverity severity() {
    return severity;
  }

  IncidentPriority priority() {
    return priority;
  }

  IncidentStatus status() {
    return status;
  }

  List<String> operationalSignals() {
    return List.copyOf(operationalSignals);
  }

  Long version() {
    return version;
  }
}
