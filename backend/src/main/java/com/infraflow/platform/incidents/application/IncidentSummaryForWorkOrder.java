package com.infraflow.platform.incidents.application;

import com.infraflow.platform.incidents.domain.IncidentId;
import com.infraflow.platform.incidents.domain.IncidentPriority;

public record IncidentSummaryForWorkOrder(
  IncidentId incidentId,
  String title,
  String description,
  String location,
  String assetId,
  IncidentPriority priority
) {
}
