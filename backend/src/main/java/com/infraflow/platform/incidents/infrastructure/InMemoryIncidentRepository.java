package com.infraflow.platform.incidents.infrastructure;

import com.infraflow.platform.incidents.application.IncidentRepository;
import com.infraflow.platform.incidents.application.IncidentSearchCriteria;
import com.infraflow.platform.incidents.domain.AssetId;
import com.infraflow.platform.incidents.domain.Incident;
import com.infraflow.platform.incidents.domain.IncidentSeverity;
import com.infraflow.platform.incidents.domain.IncidentStatus;
import com.infraflow.platform.shared.kernel.IncidentId;
import com.infraflow.platform.shared.kernel.IncidentPriority;
import java.time.OffsetDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;
import org.springframework.context.annotation.Profile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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
  public Page<Incident> search(IncidentSearchCriteria criteria, Pageable pageable) {
    String normalizedSearchTerm = criteria.searchTerm().toLowerCase(Locale.ROOT);

    List<Incident> filtered = incidents.values().stream()
      .filter(incident -> criteria.severity().isEmpty() || incident.severity() == criteria.severity().get())
      .filter(incident -> searchableText(incident).contains(normalizedSearchTerm))
      .sorted(comparatorFor(pageable.getSort()))
      .toList();

    int from = (int) Math.min(pageable.getOffset(), filtered.size());
    int to = Math.min(from + pageable.getPageSize(), filtered.size());

    return new PageImpl<>(filtered.subList(from, to), pageable, filtered.size());
  }

  private Comparator<Incident> comparatorFor(Sort sort) {
    Sort.Order order = sort.stream().findFirst().orElse(null);
    if (order == null) {
      return Comparator.comparing(Incident::reportedAt).reversed();
    }

    Comparator<Incident> comparator = switch (order.getProperty()) {
      case "title" -> Comparator.comparing(Incident::title);
      case "severity" -> Comparator.comparing(Incident::severity);
      case "status" -> Comparator.comparing(Incident::status);
      case "id" -> Comparator.comparing(incident -> incident.id().value());
      default -> Comparator.comparing(Incident::reportedAt);
    };

    return order.isAscending() ? comparator : comparator.reversed();
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
      List.of("Smoke detected", "Lighting unavailable", "Traffic active"),
      0L
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
      List.of("Sensor mismatch", "Fallback sensor active"),
      0L
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
      List.of(),
      0L
    ));
  }
}
