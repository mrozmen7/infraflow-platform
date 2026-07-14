package com.infraflow.platform.assets.infrastructure;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

interface SpringDataAssetJpaRepository extends JpaRepository<AssetJpaEntity, String> {
  @Query("""
    select asset from AssetJpaEntity asset
    where lower(asset.id) like lower(concat('%', :searchTerm, '%'))
       or lower(asset.name) like lower(concat('%', :searchTerm, '%'))
       or lower(asset.type) like lower(concat('%', :searchTerm, '%'))
       or lower(asset.location) like lower(concat('%', :searchTerm, '%'))
    order by asset.id
    """)
  List<AssetJpaEntity> search(@Param("searchTerm") String searchTerm);
}
