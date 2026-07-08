package com.infraflow.platform.shared.security.web;

import jakarta.validation.constraints.NotBlank;

public record RefreshTokenRequest(
  @NotBlank String refreshToken
) {
}

