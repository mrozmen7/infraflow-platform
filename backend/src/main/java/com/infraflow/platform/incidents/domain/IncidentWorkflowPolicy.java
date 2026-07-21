package com.infraflow.platform.incidents.domain;

import com.infraflow.platform.shared.error.BusinessRuleViolationException;

public final class IncidentWorkflowPolicy {

  private IncidentWorkflowPolicy() {
  }

  public static void ensureCanAcknowledge(Incident incident) {
    if (incident.status() != IncidentStatus.OPEN) {
      throw new BusinessRuleViolationException(
        "Only open incidents can be acknowledged."
      );
    }
  }

  public static void ensureCanStartResponse(Incident incident) {
    if (incident.status() != IncidentStatus.ACKNOWLEDGED) {
      throw new BusinessRuleViolationException(
        "Only acknowledged incidents can start an operational response."
      );
    }
  }

  public static void ensureCanResolve(Incident incident) {
    if (incident.status() != IncidentStatus.IN_PROGRESS) {
      throw new BusinessRuleViolationException(
        "Only incidents with an active response can be resolved."
      );
    }
  }
}
