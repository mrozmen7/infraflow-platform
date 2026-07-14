package com.infraflow.platform.workorders.web;

import com.infraflow.platform.workorders.domain.WorkOrder;

public record WorkOrderWorkflowResponse(String outcome, WorkOrderResponse workOrder) {
  static WorkOrderWorkflowResponse from(String outcome, WorkOrder workOrder) {
    return new WorkOrderWorkflowResponse(outcome, WorkOrderResponse.from(workOrder));
  }
}
