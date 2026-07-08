package com.infraflow.platform.incidents.application;

import com.infraflow.platform.incidents.domain.Incident;
import com.infraflow.platform.incidents.domain.IncidentId;
import com.infraflow.platform.incidents.domain.IncidentStatus;
import com.infraflow.platform.shared.error.ResourceNotFoundException;
import java.time.Clock;
import java.time.OffsetDateTime;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class IncidentService implements IncidentLookupPort {

  private final IncidentRepository incidentRepository;
  private final Clock clock;

  public IncidentService(IncidentRepository incidentRepository, Clock clock) {
    this.incidentRepository = incidentRepository;
    this.clock = clock;
  }

  @Transactional(readOnly = true)
  public List<Incident> search(IncidentSearchCriteria criteria) {
    return incidentRepository.search(criteria);
  }

  @Transactional(readOnly = true)
  public Incident get(IncidentId incidentId) {
    return incidentRepository.findById(incidentId)
      .orElseThrow(() -> new ResourceNotFoundException("Incident %s was not found.".formatted(incidentId)));
  }

  public Incident create(CreateIncidentCommand command) {
    Incident incident = new Incident(
      incidentRepository.nextIdentity(),
      command.title(),
      command.description(),
      command.location(),
      command.assetId(),
      OffsetDateTime.now(clock),
      command.severity(),
      command.priority(),
      IncidentStatus.OPEN,
      command.operationalSignals()
    );

    return incidentRepository.save(incident);
  }

  public Incident acknowledge(IncidentId incidentId) {
    return incidentRepository.save(get(incidentId).acknowledge());
  }

  public Incident startResponse(IncidentId incidentId) {
    return incidentRepository.save(get(incidentId).startResponse());
  }

  public Incident resolve(IncidentId incidentId) {
    return incidentRepository.save(get(incidentId).resolve());
  }

  @Override
  @Transactional(readOnly = true)
  public IncidentSummaryForWorkOrder getIncidentForWorkOrder(IncidentId incidentId) {
    Incident incident = get(incidentId);

    return new IncidentSummaryForWorkOrder(
      incident.id(),
      incident.title(),
      incident.description(),
      incident.location(),
      incident.assetId().value(),
      incident.priority()
    );
  }
}
