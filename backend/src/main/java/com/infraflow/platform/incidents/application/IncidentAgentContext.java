package com.infraflow.platform.incidents.application;

public record IncidentAgentContext(
  String incidentId,
  boolean critical
) {
}
