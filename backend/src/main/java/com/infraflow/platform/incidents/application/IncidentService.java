package com.infraflow.platform.incidents.application;

import com.infraflow.platform.incidents.domain.Incident;
import com.infraflow.platform.incidents.domain.IncidentId;
import com.infraflow.platform.incidents.domain.IncidentStatus;
import com.infraflow.platform.shared.audit.AuditLogService;
import com.infraflow.platform.shared.audit.AuditOutcome;
import com.infraflow.platform.shared.error.ResourceNotFoundException;
import com.infraflow.platform.shared.security.CurrentActorProvider;
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Timer;
import java.time.Clock;
import java.time.OffsetDateTime;
import java.util.function.Function;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class IncidentService implements IncidentLookupPort {

  private final IncidentRepository incidentRepository;
  private final AuditLogService auditLogService;
  private final CurrentActorProvider actorProvider;
  private final Clock clock;
  private final MeterRegistry meterRegistry;

  public IncidentService(
    IncidentRepository incidentRepository,
    AuditLogService auditLogService,
    CurrentActorProvider actorProvider,
    Clock clock,
    MeterRegistry meterRegistry
  ) {
    this.incidentRepository = incidentRepository;
    this.auditLogService = auditLogService;
    this.actorProvider = actorProvider;
    this.clock = clock;
    this.meterRegistry = meterRegistry;
  }

  @Transactional(readOnly = true)
  public Page<Incident> search(IncidentSearchCriteria criteria, Pageable pageable) {
    return incidentRepository.search(criteria, pageable);
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
      command.operationalSignals(),
      null
    );

    Incident saved = incidentRepository.save(incident);
    auditLogService.record(
      actorProvider.currentActor(),
      "INCIDENT_CREATE",
      "INCIDENT",
      saved.id().value(),
      AuditOutcome.SUCCESS,
      "Incident was created."
    );

    return saved;
  }

  public Incident acknowledge(IncidentId incidentId) {
    return transition(
      incidentId,
      "INCIDENT_ACKNOWLEDGE",
      Incident::acknowledge,
      "Incident was acknowledged."
    );
  }

  public Incident startResponse(IncidentId incidentId) {
    return transition(
      incidentId,
      "INCIDENT_START_RESPONSE",
      Incident::startResponse,
      "Incident response workflow was started."
    );
  }

  public Incident resolve(IncidentId incidentId) {
    return transition(
      incidentId,
      "INCIDENT_RESOLVE",
      Incident::resolve,
      "Incident was resolved."
    );
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

  private Incident transition(
    IncidentId incidentId,
    String action,
    Function<Incident, Incident> transition,
    String successMessage
  ) {
    String actor = actorProvider.currentActor();
    Timer.Sample sample = Timer.start(meterRegistry);
    String outcome = AuditOutcome.SUCCESS.name();
    try {
      Incident saved = incidentRepository.save(transition.apply(get(incidentId)));
      auditLogService.record(
        actor,
        action,
        "INCIDENT",
        saved.id().value(),
        AuditOutcome.SUCCESS,
        successMessage
      );

      return saved;
    } catch (RuntimeException exception) {
      outcome = AuditOutcome.REJECTED.name();
      auditLogService.record(
        actor,
        action,
        "INCIDENT",
        incidentId.value(),
        AuditOutcome.REJECTED,
        exception.getMessage()
      );

      throw exception;
    } finally {
      sample.stop(Timer
        .builder("infraflow.incident.workflow")
        .description("Latency of incident workflow commands")
        .tag("action", action)
        .tag("outcome", outcome)
        .register(meterRegistry));
    }
  }
}
