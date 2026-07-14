package com.infraflow.platform.assets.application;

import com.infraflow.platform.assets.domain.Asset;
import com.infraflow.platform.assets.domain.AssetId;
import com.infraflow.platform.shared.error.ResourceNotFoundException;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class AssetService {
  private final AssetRepository assetRepository;

  public AssetService(AssetRepository assetRepository) {
    this.assetRepository = assetRepository;
  }

  public List<Asset> search(String searchTerm) {
    return assetRepository.search(searchTerm == null ? "" : searchTerm.trim());
  }

  public Asset get(AssetId assetId) {
    return assetRepository.findById(assetId)
      .orElseThrow(() -> new ResourceNotFoundException("Asset %s was not found.".formatted(assetId)));
  }
}
