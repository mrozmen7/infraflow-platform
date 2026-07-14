package com.infraflow.platform.assets.domain;

import java.util.Objects;
import java.util.regex.Pattern;

/** Stable identifier for a managed infrastructure asset. */
public record AssetId(String value) {

  private static final Pattern FORMAT = Pattern.compile("[A-Z]{2,5}-[A-Z]{2,5}-\\d{3}");

  public AssetId {
    Objects.requireNonNull(value, "Asset id is required.");
    value = value.trim();

    if (!FORMAT.matcher(value).matches()) {
      throw new IllegalArgumentException("Asset id must use the format TYPE-SITE-001.");
    }
  }

  @Override
  public String toString() {
    return value;
  }
}
