package com.infraflow.platform;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class OpenApiControllerTests {

  @Autowired
  private MockMvc mockMvc;

  @Test
  void exposesOpenApiDocument() throws Exception {
    mockMvc.perform(get("/v3/api-docs"))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.info.title").value("InfraFlow Operations API"))
      .andExpect(jsonPath("$.components.securitySchemes.bearerAuth.scheme").value("bearer"))
      .andExpect(jsonPath("$.paths['/api/v1/auth/login']").exists())
      .andExpect(jsonPath("$.paths['/api/v1/incidents']").exists())
      .andExpect(jsonPath("$.paths['/api/v1/work-orders']").exists());
  }
}
