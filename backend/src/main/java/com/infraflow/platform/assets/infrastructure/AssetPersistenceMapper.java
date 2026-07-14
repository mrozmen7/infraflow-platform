package com.infraflow.platform.assets.infrastructure;

import com.infraflow.platform.assets.domain.Asset;
import com.infraflow.platform.assets.domain.AssetId;

final class AssetPersistenceMapper {
  private AssetPersistenceMapper() { }
  static Asset toDomain(AssetJpaEntity entity) {
    return new Asset(new AssetId(entity.id()), entity.name(), entity.type(), entity.location(), entity.criticality(), entity.status(), entity.lastInspectedAt());
  }
}
