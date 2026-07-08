package com.infraflow.platform.shared.error;

import java.time.Instant;
import java.util.List;

public record ApiError(
  Instant timestamp,
  int status,
  String error,
  String message,
  String path,
  List<ApiFieldError> fields
) {
}
