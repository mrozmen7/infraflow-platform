package com.infraflow.platform.workorders.domain;

import com.fasterxml.jackson.annotation.JsonValue;

public enum WorkOrderStatus {
  DRAFT("Draft"),
  READY("Ready"),
  IN_PROGRESS("In Progress"),
  DONE("Done");

  private final String apiValue;

  WorkOrderStatus(String apiValue) {
    this.apiValue = apiValue;
  }

  @JsonValue
  public String apiValue() {
    return apiValue;
  }
}
