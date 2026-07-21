package com.infraflow.platform.incidents.application;

import com.infraflow.platform.shared.kernel.IncidentId;

public interface IncidentLookupPort {

  IncidentSummaryForWorkOrder getIncidentForWorkOrder(IncidentId incidentId);
}
