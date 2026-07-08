package com.infraflow.platform.workorders.domain;

import java.util.Objects;
import java.util.regex.Pattern;

public record WorkOrderId(String value) {

  private static final Pattern WORK_ORDER_ID_PATTERN = Pattern.compile("WO-\\d{4}-\\d{4}");

  public WorkOrderId {
    Objects.requireNonNull(value, "Work order id is required.");

    if (!WORK_ORDER_ID_PATTERN.matcher(value).matches()) {
      throw new IllegalArgumentException("Work order id must use WO-YYYY-0001 format.");
    }
  }

  @Override
  public String toString() {
    return value;
  }
}
