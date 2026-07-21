package com.infraflow.platform.workorders.application;

import com.infraflow.platform.shared.kernel.IncidentId;

public record DraftWorkOrderCommand(IncidentId incidentId) {
}
