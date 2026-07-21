package com.infraflow.platform.incidents.application;

import com.infraflow.platform.incidents.domain.Incident;
import com.infraflow.platform.incidents.domain.IncidentId;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface IncidentRepository {

  Page<Incident> search(IncidentSearchCriteria criteria, Pageable pageable);

  Optional<Incident> findById(IncidentId incidentId);

  Incident save(Incident incident);

  IncidentId nextIdentity();
}
