package com.infraflow.platform.shared.security;

import java.time.Duration;
import java.util.List;
import java.util.Map;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "infraflow.security")
public record SecurityProperties(
  Jwt jwt,
  Map<String, DemoUser> users
) {

  public record Jwt(
    String issuer,
    String secret,
    Duration accessTokenTtl,
    Duration refreshTokenTtl
  ) {
  }

  public record DemoUser(
    String password,
    List<String> roles
  ) {
  }
}

