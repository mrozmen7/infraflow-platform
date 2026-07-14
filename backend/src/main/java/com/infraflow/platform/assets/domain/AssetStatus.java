package com.infraflow.platform.assets.domain;

import com.fasterxml.jackson.annotation.JsonValue;

public enum AssetStatus {
  OPERATIONAL("Operational"),
  DEGRADED("Degraded"),
  MAINTENANCE("Maintenance"),
  OUT_OF_SERVICE("Out of Service");

  private final String apiValue;

  AssetStatus(String apiValue) { this.apiValue = apiValue; }

  @JsonValue
  public String apiValue() { return apiValue; }
}
