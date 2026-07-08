package com.infraflow.platform.incidents.infrastructure;

import com.infraflow.platform.incidents.application.IncidentRepository;
import com.infraflow.platform.incidents.application.IncidentSearchCriteria;
import com.infraflow.platform.incidents.domain.AssetId;
import com.infraflow.platform.incidents.domain.Incident;
import com.infraflow.platform.incidents.domain.IncidentId;
import com.infraflow.platform.incidents.domain.IncidentPriority;
import com.infraflow.platform.incidents.domain.IncidentSeverity;
import com.infraflow.platform.incidents.domain.IncidentStatus;
import java.time.OffsetDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Repository;

@Repository
@Profile("inmemory")
class InMemoryIncidentRepository implements IncidentRepository {

  private final Map<IncidentId, Incident> incidents = new ConcurrentHashMap<>();
  private final AtomicInteger sequence = new AtomicInteger(4);

  InMemoryIncidentRepository() {
    seed();
  }

  @Override
  public List<Incident> search(IncidentSearchCriteria criteria) {
    String normalizedSearchTerm = criteria.searchTerm().toLowerCase(Locale.ROOT);

    return incidents.values().stream()
      .filter(incident -> criteria.severity().isEmpty() || incident.severity() == criteria.severity().get())
      .filter(incident -> searchableText(incident).contains(normalizedSearchTerm))
      .sorted(Comparator.comparing(Incident::reportedAt).reversed())
      .toList();
  }

  @Override
  public Optional<Incident> findById(IncidentId incidentId) {
    return Optional.ofNullable(incidents.get(incidentId));
  }

  @Override
  public Incident save(Incident incident) {
    incidents.put(incident.id(), incident);
    return incident;
  }

  @Override
  public IncidentId nextIdentity() {
    return new IncidentId("INC-%d-%04d".formatted(OffsetDateTime.now().getYear(), sequence.getAndIncrement()));
  }

  private String searchableText(Incident incident) {
    return String.join(
      " ",
      incident.id().value(),
      incident.title(),
      incident.location(),
      incident.assetId().value()
    ).toLowerCase(Locale.ROOT);
  }

  private void seed() {
    save(new Incident(
      new IncidentId("INC-2026-0001"),
      "Transformer smoke detected",
      "Smoke and a burnt smell were reported near the north tunnel transformer room.",
      "North Tunnel · KM 3.0",
      new AssetId("TRF-NT-003"),
      OffsetDateTime.parse("2026-06-30T15:42:00Z"),
      IncidentSeverity.CRITICAL,
      IncidentPriority.P1,
      IncidentStatus.OPEN,
      List.of("Smoke detected", "Lighting unavailable", "Traffic active")
    ));
    save(new Incident(
      new IncidentId("INC-2026-0002"),
      "Ventilation sensor drift",
      "Air-flow readings differ from the redundant sensor by more than eight percent.",
      "West Tunnel · Ventilation Zone B",
      new AssetId("SNS-WT-118"),
      OffsetDateTime.parse("2026-06-30T14:18:00Z"),
      IncidentSeverity.HIGH,
      IncidentPriority.P2,
      IncidentStatus.IN_PROGRESS,
      List.of("Sensor mismatch", "Fallback sensor active")
    ));
    save(new Incident(
      new IncidentId("INC-2026-0003"),
      "Emergency phone inspection due",
      "The scheduled functional check has not yet been confirmed by the field team.",
      "South Tunnel · Bay 12",
      new AssetId("TEL-ST-012"),
      OffsetDateTime.parse("2026-06-29T08:05:00Z"),
      IncidentSeverity.MEDIUM,
      IncidentPriority.P3,
      IncidentStatus.ACKNOWLEDGED,
      List.of()
    ));
  }
}
