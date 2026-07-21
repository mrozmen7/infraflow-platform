package com.infraflow.platform.incidents;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.infraflow.platform.incidents.domain.AssetId;
import com.infraflow.platform.incidents.domain.Incident;
import com.infraflow.platform.incidents.domain.IncidentId;
import com.infraflow.platform.incidents.domain.IncidentPriority;
import com.infraflow.platform.incidents.domain.IncidentSeverity;
import com.infraflow.platform.incidents.domain.IncidentStatus;
import com.infraflow.platform.shared.error.BusinessRuleViolationException;
import java.time.OffsetDateTime;
import java.util.List;
import org.junit.jupiter.api.Test;

class IncidentWorkflowPolicyTests {

  @Test
  void openIncidentCanBeAcknowledged() {
    Incident acknowledged = incident(IncidentStatus.OPEN).acknowledge();

    assertThat(acknowledged.status()).isEqualTo(IncidentStatus.ACKNOWLEDGED);
  }

  @Test
  void inProgressIncidentCannotBeAcknowledgedAgain() {
    assertThatThrownBy(() -> incident(IncidentStatus.IN_PROGRESS).acknowledge())
      .isInstanceOf(BusinessRuleViolationException.class)
      .hasMessage("Only open incidents can be acknowledged.");
  }

  @Test
  void acknowledgedIncidentCanStartResponse() {
    Incident inProgress = incident(IncidentStatus.ACKNOWLEDGED).startResponse();

    assertThat(inProgress.status()).isEqualTo(IncidentStatus.IN_PROGRESS);
  }

  @Test
  void openIncidentCannotStartResponseDirectly() {
    assertThatThrownBy(() -> incident(IncidentStatus.OPEN).startResponse())
      .isInstanceOf(BusinessRuleViolationException.class)
      .hasMessage("Only acknowledged incidents can start an operational response.");
  }

  @Test
  void inProgressIncidentCanBeResolved() {
    Incident resolved = incident(IncidentStatus.IN_PROGRESS).resolve();

    assertThat(resolved.status()).isEqualTo(IncidentStatus.RESOLVED);
  }

  @Test
  void openIncidentCannotBeResolvedDirectly() {
    assertThatThrownBy(() -> incident(IncidentStatus.OPEN).resolve())
      .isInstanceOf(BusinessRuleViolationException.class)
      .hasMessage("Only incidents with an active response can be resolved.");
  }

  @Test
  void acknowledgedIncidentCannotBeResolvedWithoutActiveResponse() {
    assertThatThrownBy(() -> incident(IncidentStatus.ACKNOWLEDGED).resolve())
      .isInstanceOf(BusinessRuleViolationException.class)
      .hasMessage("Only incidents with an active response can be resolved.");
  }

  @Test
  void resolvedIncidentCannotBeResolvedAgain() {
    assertThatThrownBy(() -> incident(IncidentStatus.RESOLVED).resolve())
      .isInstanceOf(BusinessRuleViolationException.class)
      .hasMessage("Only incidents with an active response can be resolved.");
  }

  private Incident incident(IncidentStatus status) {
    return new Incident(
      new IncidentId("INC-2026-0009"),
      "Transformer smoke detected",
      "Smoke reported near the transformer room.",
      "North Tunnel · KM 3.0",
      new AssetId("TRF-NT-003"),
      OffsetDateTime.parse("2026-06-30T15:42:00Z"),
      IncidentSeverity.CRITICAL,
      IncidentPriority.P1,
      status,
      List.of("Smoke detected"),
      0L
    );
  }
}
