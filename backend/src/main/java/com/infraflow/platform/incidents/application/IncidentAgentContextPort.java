package com.infraflow.platform.incidents.application;

import com.infraflow.platform.shared.kernel.IncidentId;

public interface IncidentAgentContextPort {

  IncidentAgentContext getAgentContext(IncidentId incidentId);
}
