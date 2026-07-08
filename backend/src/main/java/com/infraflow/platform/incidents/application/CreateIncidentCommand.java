package com.infraflow.platform.incidents.application;

import com.infraflow.platform.incidents.domain.AssetId;
import com.infraflow.platform.incidents.domain.IncidentPriority;
import com.infraflow.platform.incidents.domain.IncidentSeverity;
import java.util.List;

public record CreateIncidentCommand(
  String title,
  String description,
  String location,
  AssetId assetId,
  IncidentSeverity severity,
  IncidentPriority priority,
  List<String> operationalSignals
) {
}
