package com.infraflow.platform.incidents.application;

import com.infraflow.platform.incidents.domain.Incident;
import com.infraflow.platform.incidents.domain.IncidentId;
import java.util.List;
import java.util.Optional;

public interface IncidentRepository {

  List<Incident> search(IncidentSearchCriteria criteria);

  Optional<Incident> findById(IncidentId incidentId);

  Incident save(Incident incident);

  IncidentId nextIdentity();
}
