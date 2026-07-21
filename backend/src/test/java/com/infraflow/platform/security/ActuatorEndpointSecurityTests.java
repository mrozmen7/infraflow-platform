package com.infraflow.platform.security;

import static org.hamcrest.Matchers.containsString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
class ActuatorEndpointSecurityTests {

  @Autowired
  private MockMvc mockMvc;

  @Test
  void exposesHealthEndpointPublicly() throws Exception {
    mockMvc.perform(get("/actuator/health"))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.status").value("UP"));
  }

  @Test
  void exposesInfoEndpointPublicly() throws Exception {
    mockMvc.perform(get("/actuator/info"))
      .andExpect(status().isOk());
  }

  @Test
  void exposesPrometheusEndpointPublicly() throws Exception {
    mockMvc.perform(get("/actuator/prometheus"))
      .andExpect(status().isOk())
      .andExpect(content().string(containsString("jvm_memory_used_bytes")));
  }

  @Test
  void rejectsUnauthenticatedAccessToOtherActuatorEndpoints() throws Exception {
    mockMvc.perform(get("/actuator/metrics"))
      .andExpect(status().isUnauthorized())
      .andExpect(jsonPath("$.message").value("Authentication is required."));
  }

  @Test
  @WithMockUser(roles = "OPERATOR")
  void rejectsOperatorRoleOnOtherActuatorEndpoints() throws Exception {
    mockMvc.perform(get("/actuator/metrics"))
      .andExpect(status().isForbidden())
      .andExpect(jsonPath("$.message").value("Access is denied."));
  }

  @Test
  @WithMockUser(roles = "ADMIN")
  void letsAdminReachOtherActuatorEndpoints() throws Exception {
    // Not exposed over HTTP, so a passed authorization check surfaces as 404.
    mockMvc.perform(get("/actuator/metrics"))
      .andExpect(status().isNotFound());
  }

  @Test
  @WithMockUser(username = "operator", roles = "OPERATOR")
  void publishesWorkflowTimerAndAuditCounterOnPrometheusEndpoint() throws Exception {
    mockMvc.perform(post("/api/v1/incidents/INC-2026-0001/acknowledge"))
      .andExpect(status().isOk());

    mockMvc.perform(get("/actuator/prometheus"))
      .andExpect(status().isOk())
      .andExpect(content().string(containsString(
        "infraflow_incident_workflow_seconds_count{action=\"INCIDENT_ACKNOWLEDGE\",outcome=\"SUCCESS\"")))
      .andExpect(content().string(containsString(
        "infraflow_audit_events_total{action=\"INCIDENT_ACKNOWLEDGE\",outcome=\"SUCCESS\"")));
  }
}
