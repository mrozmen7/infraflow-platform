package com.infraflow.platform.incidents.infrastructure;

import com.infraflow.platform.incidents.application.IncidentRepository;
import com.infraflow.platform.incidents.application.IncidentSearchCriteria;
import com.infraflow.platform.incidents.domain.Incident;
import com.infraflow.platform.incidents.domain.IncidentId;
import java.util.List;
import java.util.Optional;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Repository;

@Repository
@Profile("!inmemory")
class JpaIncidentRepository implements IncidentRepository {

  private final SpringDataIncidentJpaRepository springDataRepository;

  JpaIncidentRepository(SpringDataIncidentJpaRepository springDataRepository) {
    this.springDataRepository = springDataRepository;
  }

  @Override
  public List<Incident> search(IncidentSearchCriteria criteria) {
    return springDataRepository.search(criteria.searchTerm(), criteria.severity().orElse(null))
      .stream()
      .map(IncidentPersistenceMapper::toDomain)
      .toList();
  }

  @Override
  public Optional<Incident> findById(IncidentId incidentId) {
    return springDataRepository.findById(incidentId.value())
      .map(IncidentPersistenceMapper::toDomain);
  }

  @Override
  public Incident save(Incident incident) {
    IncidentJpaEntity entity = springDataRepository.save(IncidentPersistenceMapper.toEntity(incident));
    return IncidentPersistenceMapper.toDomain(entity);
  }

  @Override
  public IncidentId nextIdentity() {
    long nextNumber = springDataRepository.nextIncidentNumber();
    return new IncidentId("INC-%d-%04d".formatted(java.time.Year.now().getValue(), nextNumber));
  }
}
