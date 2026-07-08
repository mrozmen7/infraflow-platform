package com.infraflow.platform.incidents.web;

import com.infraflow.platform.incidents.domain.Incident;
import com.infraflow.platform.incidents.domain.IncidentPriority;
import com.infraflow.platform.incidents.domain.IncidentSeverity;
import com.infraflow.platform.incidents.domain.IncidentStatus;
import java.time.OffsetDateTime;
import java.util.List;

public record IncidentResponse(
  String id,
  String title,
  String description,
  String location,
  String assetId,
  OffsetDateTime reportedAt,
  IncidentSeverity severity,
  IncidentPriority priority,
  IncidentStatus status,
  List<String> operationalSignals
) {

  static IncidentResponse from(Incident incident) {
    return new IncidentResponse(
      incident.id().value(),
      incident.title(),
      incident.description(),
      incident.location(),
      incident.assetId().value(),
      incident.reportedAt(),
      incident.severity(),
      incident.priority(),
      incident.status(),
      incident.operationalSignals()
    );
  }
}
