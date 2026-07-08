package com.infraflow.platform.incidents.domain;

import java.util.Objects;
import java.util.regex.Pattern;

public record IncidentId(String value) {

  private static final Pattern INCIDENT_ID_PATTERN = Pattern.compile("INC-\\d{4}-\\d{4}");

  public IncidentId {
    Objects.requireNonNull(value, "Incident id is required.");

    if (!INCIDENT_ID_PATTERN.matcher(value).matches()) {
      throw new IllegalArgumentException("Incident id must use INC-YYYY-0001 format.");
    }
  }

  @Override
  public String toString() {
    return value;
  }
}
