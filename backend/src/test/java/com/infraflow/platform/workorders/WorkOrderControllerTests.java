package com.infraflow.platform.workorders;

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
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
class WorkOrderControllerTests {

  @Autowired
  private MockMvc mockMvc;

  @Test
  @WithMockUser(roles = "OPERATOR")
  void listsSeedWorkOrders() throws Exception {
    mockMvc.perform(get("/api/v1/work-orders"))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$", hasSize(1)))
      .andExpect(jsonPath("$[0].id").value("WO-2026-0001"))
      .andExpect(jsonPath("$[0].status").value("Draft"));
  }

  @Test
  @WithMockUser(roles = "OPERATOR")
  void draftsWorkOrderFromIncidentThroughExplicitModulePort() throws Exception {
    mockMvc.perform(post("/api/v1/work-orders/drafts")
        .contentType(MediaType.APPLICATION_JSON)
        .content("""
          {
            "incidentId": "INC-2026-0001"
          }
          """))
      .andExpect(status().isCreated())
      .andExpect(header().string("Location", "/api/v1/work-orders/WO-2026-1000"))
      .andExpect(jsonPath("$.incidentId").value("INC-2026-0001"))
      .andExpect(jsonPath("$.assetId").value("TRF-NT-003"))
      .andExpect(jsonPath("$.status").value("Draft"));
  }

  @Test
  @WithMockUser(roles = "OPERATOR")
  void allocatesDistinctWorkOrderIdentitiesForConsecutiveDrafts() throws Exception {
    mockMvc.perform(post("/api/v1/work-orders/drafts")
        .contentType(MediaType.APPLICATION_JSON)
        .content("""
          { "incidentId": "INC-2026-0001" }
          """))
      .andExpect(status().isCreated())
      .andExpect(header().string("Location", "/api/v1/work-orders/WO-2026-1000"));

    mockMvc.perform(post("/api/v1/work-orders/drafts")
        .contentType(MediaType.APPLICATION_JSON)
        .content("""
          { "incidentId": "INC-2026-0002" }
          """))
      .andExpect(status().isCreated())
      .andExpect(header().string("Location", "/api/v1/work-orders/WO-2026-1001"));

    mockMvc.perform(get("/api/v1/work-orders"))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$", hasSize(3)));
  }

  @Test
  @WithMockUser(roles = "OPERATOR")
  void reusesExistingDraftWhenTheSameIncidentIsSubmittedAgain() throws Exception {
    mockMvc.perform(post("/api/v1/work-orders/drafts")
        .contentType(MediaType.APPLICATION_JSON)
        .content("{ \"incidentId\": \"INC-2026-0001\" }"))
      .andExpect(status().isCreated());

    mockMvc.perform(post("/api/v1/work-orders/drafts")
        .contentType(MediaType.APPLICATION_JSON)
        .content("{ \"incidentId\": \"INC-2026-0001\" }"))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.id").value("WO-2026-1000"));
  }

  @Test
  @WithMockUser(roles = "OPERATOR")
  void movesAWorkOrderThroughTheOperatorWorkflow() throws Exception {
    mockMvc.perform(post("/api/v1/work-orders/WO-2026-0001/ready"))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.workOrder.status").value("Ready"));

    mockMvc.perform(post("/api/v1/work-orders/WO-2026-0001/start"))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.workOrder.status").value("In Progress"));

    mockMvc.perform(post("/api/v1/work-orders/WO-2026-0001/complete"))
      .andExpect(status().isForbidden());
  }

  @Test
  @WithMockUser(roles = "ADMIN")
  void permitsOnlyAdministratorsToCompleteWorkOrders() throws Exception {
    mockMvc.perform(post("/api/v1/work-orders/WO-2026-0001/ready"))
      .andExpect(status().isOk());
    mockMvc.perform(post("/api/v1/work-orders/WO-2026-0001/start"))
      .andExpect(status().isOk());
    mockMvc.perform(post("/api/v1/work-orders/WO-2026-0001/complete"))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.workOrder.status").value("Done"));
  }

  @Test
  @WithMockUser(roles = "OPERATOR")
  void rejectsInvalidDraftRequest() throws Exception {
    mockMvc.perform(post("/api/v1/work-orders/drafts")
        .contentType(MediaType.APPLICATION_JSON)
        .content("""
          {
            "incidentId": "bad-id"
          }
          """))
      .andExpect(status().isBadRequest())
      .andExpect(jsonPath("$.message").value("Request validation failed."));
  }
}
