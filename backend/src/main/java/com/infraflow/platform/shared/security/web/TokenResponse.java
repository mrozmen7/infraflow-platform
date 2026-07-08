package com.infraflow.platform.shared.security.web;

import java.util.List;

public record TokenResponse(
  String tokenType,
  String accessToken,
  String refreshToken,
  List<String> roles
) {
}

