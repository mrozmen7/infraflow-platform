package com.infraflow.platform.workorders.application;

import com.infraflow.platform.workorders.domain.WorkOrder;

/** Result of an idempotent draft request. */
public record DraftWorkOrderResult(WorkOrder workOrder, boolean created) {
}
