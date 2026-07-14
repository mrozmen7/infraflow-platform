package com.infraflow.platform.security;

import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.not;
import static org.hamcrest.Matchers.blankOrNullString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import jakarta.servlet.http.Cookie;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AuthControllerTests {

  @Autowired
  private MockMvc mockMvc;

  @Test
  void logsInOperatorAndSetsHttpOnlyRefreshCookie() throws Exception {
    mockMvc.perform(post("/api/v1/auth/login")
        .contentType(MediaType.APPLICATION_JSON)
        .content("""
          {
            "username": "operator",
            "password": "operator"
          }
          """))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.tokenType").value("Bearer"))
      .andExpect(jsonPath("$.accessToken", not(blankOrNullString())))
      .andExpect(jsonPath("$.refreshToken").doesNotExist())
      .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.header().string(
        "Set-Cookie", org.hamcrest.Matchers.containsString("HttpOnly")
      ))
      .andExpect(jsonPath("$.roles", hasItem("OPERATOR")));
  }

  @Test
  void rejectsInvalidCredentials() throws Exception {
    mockMvc.perform(post("/api/v1/auth/login")
        .contentType(MediaType.APPLICATION_JSON)
        .content("""
          {
            "username": "operator",
            "password": "wrong"
          }
          """))
      .andExpect(status().isUnauthorized())
      .andExpect(jsonPath("$.message").value("Authentication failed."));
  }

  @Test
  void refreshesAccessTokenFromHttpOnlyCookie() throws Exception {
    String setCookie = mockMvc.perform(post("/api/v1/auth/login")
        .contentType(MediaType.APPLICATION_JSON)
        .content("""
          {
            "username": "admin",
            "password": "admin"
          }
          """))
      .andExpect(status().isOk())
      .andReturn().getResponse().getHeader("Set-Cookie");
    String refreshToken = setCookie.substring("infraflow_refresh=".length(), setCookie.indexOf(';'));

    mockMvc.perform(post("/api/v1/auth/refresh")
        .cookie(new Cookie("infraflow_refresh", refreshToken)))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.tokenType").value("Bearer"))
      .andExpect(jsonPath("$.accessToken", not(blankOrNullString())))
      .andExpect(jsonPath("$.roles", hasItem("ADMIN")))
      .andExpect(jsonPath("$.roles", hasItem("OPERATOR")));
  }
}
