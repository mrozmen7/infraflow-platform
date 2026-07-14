package com.infraflow.platform.assets.infrastructure;

import com.infraflow.platform.assets.application.AssetRepository;
import com.infraflow.platform.assets.domain.Asset;
import com.infraflow.platform.assets.domain.AssetId;
import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Repository;

@Repository
class JpaAssetRepository implements AssetRepository {
  private final SpringDataAssetJpaRepository springDataRepository;
  JpaAssetRepository(SpringDataAssetJpaRepository springDataRepository) { this.springDataRepository = springDataRepository; }
  @Override public List<Asset> search(String searchTerm) { return springDataRepository.search(searchTerm).stream().map(AssetPersistenceMapper::toDomain).toList(); }
  @Override public Optional<Asset> findById(AssetId assetId) { return springDataRepository.findById(assetId.value()).map(AssetPersistenceMapper::toDomain); }
}
