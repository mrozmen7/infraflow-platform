package com.infraflow.platform.assets.application;

import com.infraflow.platform.assets.domain.Asset;
import com.infraflow.platform.assets.domain.AssetId;
import java.util.List;
import java.util.Optional;

public interface AssetRepository {
  List<Asset> search(String searchTerm);
  Optional<Asset> findById(AssetId assetId);
}
