package com.infraflow.platform.incidents.domain;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import java.util.Arrays;

public enum IncidentPriority {
  P1,
  P2,
  P3,
  P4;

  @JsonValue
  public String apiValue() {
    return name();
  }

  @JsonCreator
  public static IncidentPriority from(String value) {
    return Arrays.stream(values())
      .filter(priority -> priority.name().equalsIgnoreCase(value))
      .findFirst()
      .orElseThrow(() -> new IllegalArgumentException("Unsupported incident priority: " + value));
  }
}
