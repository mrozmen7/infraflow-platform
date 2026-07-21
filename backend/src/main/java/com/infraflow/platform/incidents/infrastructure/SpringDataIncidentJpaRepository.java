package com.infraflow.platform.incidents.infrastructure;

import com.infraflow.platform.incidents.domain.IncidentSeverity;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

interface SpringDataIncidentJpaRepository extends JpaRepository<IncidentJpaEntity, String> {

  @Override
  @EntityGraph(attributePaths = "operationalSignals")
  Optional<IncidentJpaEntity> findById(String id);

  // No collection fetch join here: pagination over a collection join would force
  // in-memory paging. Operational signals load lazily inside the read transaction.
  @Query("""
    select incident
    from IncidentJpaEntity incident
    where (:severity is null or incident.severity = :severity)
      and lower(concat(incident.id, ' ', incident.title, ' ', incident.location, ' ', incident.assetId))
        like lower(concat('%', :searchTerm, '%'))
    """)
  Page<IncidentJpaEntity> search(
    @Param("searchTerm") String searchTerm,
    @Param("severity") IncidentSeverity severity,
    Pageable pageable
  );

  @Query(value = "select nextval('incident_number_sequence')", nativeQuery = true)
  long nextIncidentNumber();
}
