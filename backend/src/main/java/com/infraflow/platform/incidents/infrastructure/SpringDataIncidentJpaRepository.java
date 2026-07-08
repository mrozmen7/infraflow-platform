package com.infraflow.platform.incidents.infrastructure;

import com.infraflow.platform.incidents.domain.IncidentSeverity;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

interface SpringDataIncidentJpaRepository extends JpaRepository<IncidentJpaEntity, String> {

  @Override
  @EntityGraph(attributePaths = "operationalSignals")
  Optional<IncidentJpaEntity> findById(String id);

  @EntityGraph(attributePaths = "operationalSignals")
  @Query("""
    select incident
    from IncidentJpaEntity incident
    where (:severity is null or incident.severity = :severity)
      and lower(concat(incident.id, ' ', incident.title, ' ', incident.location, ' ', incident.assetId))
        like lower(concat('%', :searchTerm, '%'))
    order by incident.reportedAt desc
    """)
  List<IncidentJpaEntity> search(
    @Param("searchTerm") String searchTerm,
    @Param("severity") IncidentSeverity severity
  );
}
