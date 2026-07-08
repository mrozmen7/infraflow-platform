package com.infraflow.platform.incidents.application;

import com.infraflow.platform.incidents.domain.IncidentId;

public interface IncidentLookupPort {

  IncidentSummaryForWorkOrder getIncidentForWorkOrder(IncidentId incidentId);
}
