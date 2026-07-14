package com.infraflow.platform.assets.domain;

import java.time.OffsetDateTime;
import java.util.Objects;

/** Canonical record for an inspectable infrastructure asset. */
public record Asset(
  AssetId id,
  String name,
  String type,
  String location,
  AssetCriticality criticality,
  AssetStatus status,
  OffsetDateTime lastInspectedAt
) {

  public Asset {
    Objects.requireNonNull(id, "Asset id is required.");
    Objects.requireNonNull(criticality, "Asset criticality is required.");
    Objects.requireNonNull(status, "Asset status is required.");
    Objects.requireNonNull(lastInspectedAt, "Last inspection time is required.");
    name = requireText(name, "Asset name is required.");
    type = requireText(type, "Asset type is required.");
    location = requireText(location, "Asset location is required.");
  }

  private static String requireText(String value, String message) {
    if (value == null || value.isBlank()) { throw new IllegalArgumentException(message); }
    return value.trim();
  }
}
