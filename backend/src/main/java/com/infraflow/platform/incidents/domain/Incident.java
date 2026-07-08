package com.infraflow.platform.incidents.domain;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Objects;

public record Incident(
  IncidentId id,
  String title,
  String description,
  String location,
  AssetId assetId,
  OffsetDateTime reportedAt,
  IncidentSeverity severity,
  IncidentPriority priority,
  IncidentStatus status,
  List<String> operationalSignals,
  Long version
) {

  public Incident {
    Objects.requireNonNull(id, "Incident id is required.");
    Objects.requireNonNull(assetId, "Asset id is required.");
    Objects.requireNonNull(reportedAt, "Reported time is required.");
    Objects.requireNonNull(severity, "Severity is required.");
    Objects.requireNonNull(priority, "Priority is required.");
    Objects.requireNonNull(status, "Status is required.");
    title = requireText(title, "Title is required.");
    description = requireText(description, "Description is required.");
    location = requireText(location, "Location is required.");
    operationalSignals = List.copyOf(operationalSignals == null ? List.of() : operationalSignals);
  }

  public Incident acknowledge() {
    IncidentWorkflowPolicy.ensureCanAcknowledge(this);
    return withStatus(IncidentStatus.ACKNOWLEDGED);
  }

  public Incident startResponse() {
    IncidentWorkflowPolicy.ensureCanStartResponse(this);
    return withStatus(IncidentStatus.IN_PROGRESS);
  }

  public Incident resolve() {
    IncidentWorkflowPolicy.ensureCanResolve(this);
    return withStatus(IncidentStatus.RESOLVED);
  }

  public Incident withStatus(IncidentStatus nextStatus) {
    return new Incident(
      id,
      title,
      description,
      location,
      assetId,
      reportedAt,
      severity,
      priority,
      nextStatus,
      operationalSignals,
      version
    );
  }

  private static String requireText(String value, String message) {
    if (value == null || value.isBlank()) {
      throw new IllegalArgumentException(message);
    }

    return value.trim();
  }
}
