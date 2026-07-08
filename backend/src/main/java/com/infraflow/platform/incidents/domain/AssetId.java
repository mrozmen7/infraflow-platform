package com.infraflow.platform.incidents.domain;

import java.util.Objects;

public record AssetId(String value) {

  public AssetId {
    Objects.requireNonNull(value, "Asset id is required.");

    if (value.isBlank()) {
      throw new IllegalArgumentException("Asset id must not be blank.");
    }
  }

  @Override
  public String toString() {
    return value;
  }
}
