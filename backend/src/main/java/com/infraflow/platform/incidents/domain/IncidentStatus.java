package com.infraflow.platform.incidents.domain;

import com.fasterxml.jackson.annotation.JsonValue;

public enum IncidentStatus {
  OPEN("Open"),
  ACKNOWLEDGED("Acknowledged"),
  IN_PROGRESS("In Progress"),
  RESOLVED("Resolved");

  private final String apiValue;

  IncidentStatus(String apiValue) {
    this.apiValue = apiValue;
  }

  @JsonValue
  public String apiValue() {
    return apiValue;
  }
}
