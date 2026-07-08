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
  void listsSeedWorkOrders() throws Exception {
    mockMvc.perform(get("/api/v1/work-orders"))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$", hasSize(1)))
      .andExpect(jsonPath("$[0].id").value("WO-2026-0001"))
      .andExpect(jsonPath("$[0].status").value("Draft"));
  }

  @Test
  void draftsWorkOrderFromIncidentThroughExplicitModulePort() throws Exception {
    mockMvc.perform(post("/api/v1/work-orders/drafts")
        .contentType(MediaType.APPLICATION_JSON)
        .content("""
          {
            "incidentId": "INC-2026-0001"
          }
          """))
      .andExpect(status().isCreated())
      .andExpect(header().string("Location", "/api/v1/work-orders/WO-2026-0002"))
      .andExpect(jsonPath("$.incidentId").value("INC-2026-0001"))
      .andExpect(jsonPath("$.assetId").value("TRF-NT-003"))
      .andExpect(jsonPath("$.status").value("Draft"));
  }

  @Test
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
