package com.infraflow.platform.incidents.application;

import com.infraflow.platform.incidents.domain.IncidentSeverity;
import java.util.Optional;

public record IncidentSearchCriteria(
  String searchTerm,
  Optional<IncidentSeverity> severity
) {

  public IncidentSearchCriteria {
    searchTerm = searchTerm == null ? "" : searchTerm.trim();
    severity = severity == null ? Optional.empty() : severity;
  }
}
