package com.infraflow.platform.assets.infrastructure;

import com.infraflow.platform.assets.domain.AssetCriticality;
import com.infraflow.platform.assets.domain.AssetStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.OffsetDateTime;

@Entity
@Table(name = "assets")
class AssetJpaEntity {
  @Id @Column(name = "id", nullable = false, length = 40) private String id;
  @Column(name = "name", nullable = false, length = 160) private String name;
  @Column(name = "type", nullable = false, length = 80) private String type;
  @Column(name = "location", nullable = false, length = 160) private String location;
  @Enumerated(EnumType.STRING) @Column(name = "criticality", nullable = false, length = 20) private AssetCriticality criticality;
  @Enumerated(EnumType.STRING) @Column(name = "status", nullable = false, length = 30) private AssetStatus status;
  @Column(name = "last_inspected_at", nullable = false) private OffsetDateTime lastInspectedAt;

  protected AssetJpaEntity() { }

  AssetJpaEntity(String id, String name, String type, String location, AssetCriticality criticality, AssetStatus status, OffsetDateTime lastInspectedAt) {
    this.id = id; this.name = name; this.type = type; this.location = location;
    this.criticality = criticality; this.status = status; this.lastInspectedAt = lastInspectedAt;
  }
  String id() { return id; }
  String name() { return name; }
  String type() { return type; }
  String location() { return location; }
  AssetCriticality criticality() { return criticality; }
  AssetStatus status() { return status; }
  OffsetDateTime lastInspectedAt() { return lastInspectedAt; }
}
