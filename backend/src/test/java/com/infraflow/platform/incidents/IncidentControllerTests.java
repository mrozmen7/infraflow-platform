package com.infraflow.platform.incidents;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
class IncidentControllerTests {

  @Autowired
  private MockMvc mockMvc;

  @Test
  void searchesIncidentsBySeverityAndSearchTerm() throws Exception {
    mockMvc.perform(get("/api/v1/incidents")
        .queryParam("searchTerm", "tunnel")
        .queryParam("severity", "Critical"))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$", hasSize(1)))
      .andExpect(jsonPath("$[0].id").value("INC-2026-0001"))
      .andExpect(jsonPath("$[0].severity").value("Critical"));
  }

  @Test
  void getsIncidentById() throws Exception {
    mockMvc.perform(get("/api/v1/incidents/INC-2026-0001"))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.title").value("Transformer smoke detected"))
      .andExpect(jsonPath("$.assetId").value("TRF-NT-003"))
      .andExpect(jsonPath("$.status").value("Open"));
  }

  @Test
  void createsIncidentWithValidationAndLocationHeader() throws Exception {
    mockMvc.perform(post("/api/v1/incidents")
        .contentType(MediaType.APPLICATION_JSON)
        .content("""
          {
            "title": "Tunnel lighting outage",
            "description": "Lighting controller did not respond to remote reset.",
            "location": "East Tunnel · Bay 4",
            "assetId": "LGT-ET-004",
            "severity": "High",
            "priority": "P2",
            "operationalSignals": ["Lighting unavailable"]
          }
          """))
      .andExpect(status().isCreated())
      .andExpect(header().string("Location", "/api/v1/incidents/INC-2026-0004"))
      .andExpect(jsonPath("$.id").value("INC-2026-0004"))
      .andExpect(jsonPath("$.status").value("Open"));
  }

  @Test
  void rejectsInvalidIncidentRequestWithFieldErrors() throws Exception {
    mockMvc.perform(post("/api/v1/incidents")
        .contentType(MediaType.APPLICATION_JSON)
        .content("""
          {
            "title": "",
            "description": "",
            "location": "",
            "assetId": "",
            "severity": "High",
            "priority": "P2"
          }
          """))
      .andExpect(status().isBadRequest())
      .andExpect(jsonPath("$.message").value("Request validation failed."))
      .andExpect(jsonPath("$.fields", hasSize(4)));
  }

  @Test
  void acknowledgesOpenIncident() throws Exception {
    mockMvc.perform(post("/api/v1/incidents/INC-2026-0001/acknowledge"))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.status").value("Acknowledged"));
  }

  @Test
  void protectsWorkflowRulesWithConflictResponse() throws Exception {
    mockMvc.perform(post("/api/v1/incidents/INC-2026-0002/acknowledge"))
      .andExpect(status().isConflict())
      .andExpect(jsonPath("$.message").value("Only open incidents can be acknowledged."));
  }

  @Test
  void startsResponseForAcknowledgedIncident() throws Exception {
    mockMvc.perform(post("/api/v1/incidents/INC-2026-0003/start-response"))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.status").value("In Progress"));
  }

  @Test
  void returnsNotFoundForMissingIncident() throws Exception {
    mockMvc.perform(get("/api/v1/incidents/INC-2026-9999"))
      .andExpect(status().isNotFound())
      .andExpect(jsonPath("$.message").value("Incident INC-2026-9999 was not found."));
  }
}
