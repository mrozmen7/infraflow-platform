package com.infraflow.platform.workorders.application;

import com.infraflow.platform.incidents.domain.IncidentId;

public record DraftWorkOrderCommand(IncidentId incidentId) {
}
