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

  public boolean canTransitionTo(WorkOrderStatus next) {
    return switch (this) {
      case DRAFT -> next == READY;
      case READY -> next == IN_PROGRESS;
      case IN_PROGRESS -> next == DONE;
      case DONE -> false;
    };
  }
}
