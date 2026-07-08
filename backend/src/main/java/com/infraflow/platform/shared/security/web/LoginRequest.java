package com.infraflow.platform.shared.security.web;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
  @Schema(example = "operator")
  @NotBlank String username,
  @Schema(example = "operator")
  @NotBlank String password
) {
}

