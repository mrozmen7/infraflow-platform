package com.infraflow.platform.security;

import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.not;
import static org.hamcrest.Matchers.blankOrNullString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.infraflow.platform.shared.security.JwtTokenService;
import jakarta.servlet.http.Cookie;
import java.time.Duration;
import java.time.Instant;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import com.infraflow.platform.support.PostgresIntegrationTest;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AuthControllerTests extends PostgresIntegrationTest {

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private JwtTokenService tokenService;

  @Autowired
  private JwtEncoder jwtEncoder;

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
    String refreshToken = loginAndExtractRefreshToken("admin", "admin");

    mockMvc.perform(post("/api/v1/auth/refresh")
        .cookie(new Cookie("infraflow_refresh", refreshToken)))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.tokenType").value("Bearer"))
      .andExpect(jsonPath("$.accessToken", not(blankOrNullString())))
      .andExpect(jsonPath("$.roles", hasItem("ADMIN")))
      .andExpect(jsonPath("$.roles", hasItem("OPERATOR")));
  }

  @Test
  void rotatesRefreshTokenAndRejectsReplacedPredecessor() throws Exception {
    String originalRefreshToken = loginAndExtractRefreshToken("operator", "operator");

    String rotatedCookie = mockMvc.perform(post("/api/v1/auth/refresh")
        .cookie(new Cookie("infraflow_refresh", originalRefreshToken)))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.accessToken", not(blankOrNullString())))
      .andReturn().getResponse().getHeader("Set-Cookie");
    String rotatedRefreshToken = extractRefreshToken(rotatedCookie);

    mockMvc.perform(post("/api/v1/auth/refresh")
        .cookie(new Cookie("infraflow_refresh", rotatedRefreshToken)))
      .andExpect(status().isOk());

    mockMvc.perform(post("/api/v1/auth/refresh")
        .cookie(new Cookie("infraflow_refresh", originalRefreshToken)))
      .andExpect(status().isUnauthorized());
  }

  @Test
  void detectsRefreshTokenReuseAndRevokesTokenFamily() throws Exception {
    String originalRefreshToken = loginAndExtractRefreshToken("admin", "admin");

    String rotatedCookie = mockMvc.perform(post("/api/v1/auth/refresh")
        .cookie(new Cookie("infraflow_refresh", originalRefreshToken)))
      .andExpect(status().isOk())
      .andReturn().getResponse().getHeader("Set-Cookie");
    String rotatedRefreshToken = extractRefreshToken(rotatedCookie);

    // Presenting the already-replaced token signals reuse.
    mockMvc.perform(post("/api/v1/auth/refresh")
        .cookie(new Cookie("infraflow_refresh", originalRefreshToken)))
      .andExpect(status().isUnauthorized());

    // The whole token family is revoked, so the rotated token is rejected too.
    mockMvc.perform(post("/api/v1/auth/refresh")
        .cookie(new Cookie("infraflow_refresh", rotatedRefreshToken)))
      .andExpect(status().isUnauthorized());
  }

  @Test
  void logoutRevokesPresentedRefreshToken() throws Exception {
    String refreshToken = loginAndExtractRefreshToken("operator", "operator");

    mockMvc.perform(post("/api/v1/auth/logout")
        .cookie(new Cookie("infraflow_refresh", refreshToken)))
      .andExpect(status().isOk());

    mockMvc.perform(post("/api/v1/auth/refresh")
        .cookie(new Cookie("infraflow_refresh", refreshToken)))
      .andExpect(status().isUnauthorized());
  }

  @Test
  void rejectsUnknownRefreshToken() throws Exception {
    String unregisteredToken = tokenService.issue("ghost", java.util.List.of("OPERATOR")).refreshToken();

    mockMvc.perform(post("/api/v1/auth/refresh")
        .cookie(new Cookie("infraflow_refresh", unregisteredToken)))
      .andExpect(status().isUnauthorized());
  }

  @Test
  void rejectsExpiredRefreshToken() throws Exception {
    Instant now = Instant.now();
    JwtClaimsSet claims = JwtClaimsSet.builder()
      .issuer("infraflow")
      .issuedAt(now.minus(Duration.ofHours(9)))
      .expiresAt(now.minus(Duration.ofHours(1)))
      .subject("operator")
      .claim("typ", "refresh")
      .claim("roles", java.util.List.of("OPERATOR"))
      .build();
    String expiredToken = jwtEncoder.encode(JwtEncoderParameters.from(
      JwsHeader.with(MacAlgorithm.HS256).build(),
      claims
    )).getTokenValue();

    mockMvc.perform(post("/api/v1/auth/refresh")
        .cookie(new Cookie("infraflow_refresh", expiredToken)))
      .andExpect(status().isUnauthorized());
  }

  private String loginAndExtractRefreshToken(String username, String password) throws Exception {
    String setCookie = mockMvc.perform(post("/api/v1/auth/login")
        .contentType(MediaType.APPLICATION_JSON)
        .content("""
          {
            "username": "%s",
            "password": "%s"
          }
          """.formatted(username, password)))
      .andExpect(status().isOk())
      .andReturn().getResponse().getHeader("Set-Cookie");
    return extractRefreshToken(setCookie);
  }

  private String extractRefreshToken(String setCookie) {
    return setCookie.substring("infraflow_refresh=".length(), setCookie.indexOf(';'));
  }
}
