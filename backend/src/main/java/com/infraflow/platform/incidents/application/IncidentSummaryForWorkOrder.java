package com.infraflow.platform.incidents.application;

import com.infraflow.platform.shared.kernel.IncidentId;
import com.infraflow.platform.shared.kernel.IncidentPriority;

public record IncidentSummaryForWorkOrder(
  IncidentId incidentId,
  String title,
  String description,
  String location,
  String assetId,
  IncidentPriority priority
) {
}
