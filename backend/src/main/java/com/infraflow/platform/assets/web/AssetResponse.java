package com.infraflow.platform.assets.web;

import com.infraflow.platform.assets.domain.Asset;
import com.infraflow.platform.assets.domain.AssetCriticality;
import com.infraflow.platform.assets.domain.AssetStatus;
import java.time.OffsetDateTime;

public record AssetResponse(String id, String name, String type, String location, AssetCriticality criticality, AssetStatus status, OffsetDateTime lastInspectedAt) {
  static AssetResponse from(Asset asset) {
    return new AssetResponse(asset.id().value(), asset.name(), asset.type(), asset.location(), asset.criticality(), asset.status(), asset.lastInspectedAt());
  }
}
