package com.infraflow.platform.assets.domain;

import com.fasterxml.jackson.annotation.JsonValue;

public enum AssetCriticality {
  LOW("Low"),
  MEDIUM("Medium"),
  HIGH("High"),
  CRITICAL("Critical");

  private final String apiValue;

  AssetCriticality(String apiValue) { this.apiValue = apiValue; }

  @JsonValue
  public String apiValue() { return apiValue; }
}
