package com.infraflow.platform.assets;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AssetControllerTests {
  @Autowired private MockMvc mockMvc;

  @Test @WithMockUser(roles = "OPERATOR")
  void searchesTheReadOnlyAssetRegistry() throws Exception {
    mockMvc.perform(get("/api/v1/assets").queryParam("searchTerm", "ventilation"))
      .andExpect(status().isOk()).andExpect(jsonPath("$", hasSize(1)))
      .andExpect(jsonPath("$[0].id").value("SNS-WT-118"))
      .andExpect(jsonPath("$[0].status").value("Degraded"));
  }

  @Test @WithMockUser(roles = "OPERATOR")
  void getsAnAssetById() throws Exception {
    mockMvc.perform(get("/api/v1/assets/TRF-NT-003"))
      .andExpect(status().isOk()).andExpect(jsonPath("$.criticality").value("Critical"))
      .andExpect(jsonPath("$.location").value("North Tunnel · KM 3.0"));
  }

  @Test
  void rejectsUnauthenticatedAssetAccess() throws Exception {
    mockMvc.perform(get("/api/v1/assets")).andExpect(status().isUnauthorized());
  }
}
