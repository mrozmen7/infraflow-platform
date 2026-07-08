package com.infraflow.platform.incidents.domain;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import java.util.Arrays;

public enum IncidentSeverity {
  LOW("Low"),
  MEDIUM("Medium"),
  HIGH("High"),
  CRITICAL("Critical");

  private final String apiValue;

  IncidentSeverity(String apiValue) {
    this.apiValue = apiValue;
  }

  @JsonValue
  public String apiValue() {
    return apiValue;
  }

  @JsonCreator
  public static IncidentSeverity from(String value) {
    return Arrays.stream(values())
      .filter(severity ->
        severity.name().equalsIgnoreCase(value) || severity.apiValue.equalsIgnoreCase(value)
      )
      .findFirst()
      .orElseThrow(() -> new IllegalArgumentException("Unsupported incident severity: " + value));
  }
}
