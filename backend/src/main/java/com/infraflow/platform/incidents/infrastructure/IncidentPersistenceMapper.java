package com.infraflow.platform.incidents.infrastructure;

import com.infraflow.platform.incidents.domain.AssetId;
import com.infraflow.platform.incidents.domain.Incident;
import com.infraflow.platform.shared.kernel.IncidentId;

final class IncidentPersistenceMapper {

  private IncidentPersistenceMapper() {
  }

  static Incident toDomain(IncidentJpaEntity entity) {
    return new Incident(
      new IncidentId(entity.id()),
      entity.title(),
      entity.description(),
      entity.location(),
      new AssetId(entity.assetId()),
      entity.reportedAt(),
      entity.severity(),
      entity.priority(),
      entity.status(),
      entity.operationalSignals(),
      entity.version()
    );
  }

  static IncidentJpaEntity toEntity(Incident incident) {
    return new IncidentJpaEntity(
      incident.id().value(),
      incident.title(),
      incident.description(),
      incident.location(),
      incident.assetId().value(),
      incident.reportedAt(),
      incident.severity(),
      incident.priority(),
      incident.status(),
      incident.operationalSignals(),
      incident.version()
    );
  }
}
