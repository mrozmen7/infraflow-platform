package com.infraflow.platform.agentic.application;

import com.infraflow.platform.incidents.application.IncidentAgentContext;
import com.infraflow.platform.incidents.application.IncidentAgentContextPort;
import com.infraflow.platform.shared.audit.AuditLogService;
import com.infraflow.platform.shared.audit.AuditOutcome;
import com.infraflow.platform.shared.kernel.IncidentId;
import com.infraflow.platform.shared.security.CurrentActorProvider;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class IncidentAgentService {

  private final IncidentAgentContextPort incidentContexts;
  private final AuditLogService audit;
  private final CurrentActorProvider actor;

  public IncidentAgentService(
    IncidentAgentContextPort incidentContexts,
    AuditLogService audit,
    CurrentActorProvider actor
  ) {
    this.incidentContexts = incidentContexts;
    this.audit = audit;
    this.actor = actor;
  }

  public IncidentAgentProposal propose(IncidentId incidentId) {
    IncidentAgentContext context = incidentContexts.getAgentContext(incidentId);
    boolean critical = context.critical();

    IncidentAgentProposal proposal = new IncidentAgentProposal(
      "agent-" + context.incidentId().toLowerCase(),
      "mock-rule-runtime",
      critical ? "approval-required" : "advisory",
      context.incidentId(),
      List.of(
        new IncidentAgentProposal.Recommendation(
          "review-context",
          "LOW",
          "Review operational context",
          "Confirm linked asset and workflow state before acting.",
          false
        ),
        new IncidentAgentProposal.Recommendation(
          "draft-work-order",
          "MEDIUM",
          "Draft a work order",
          "Create a controlled draft from verified incident context.",
          true
        ),
        new IncidentAgentProposal.Recommendation(
          "supervisor-approval",
          critical ? "CRITICAL" : "HIGH",
          "Request supervisor approval",
          "High-impact action remains a human decision.",
          true
        )
      ),
      List.of(
        new IncidentAgentProposal.RenderBlock(
          "recommendation-card",
          "Review operational context",
          "Only allow-listed components are rendered; model HTML is never trusted."
        )
      ),
      List.of(
        new IncidentAgentProposal.ToolContract(
          "incident.read",
          "read-only",
          "Read selected incident and asset context."
        ),
        new IncidentAgentProposal.ToolContract(
          "work-order.draft",
          "approval-required",
          "Request a controlled work-order draft."
        )
      ),
      List.of(
        "Assistant output is advisory.",
        "Critical actions require explicit human approval.",
        "Backend authorization remains authoritative."
      )
    );

    audit.record(
      actor.currentActor(),
      "AGENT_PROPOSAL_GENERATED",
      "INCIDENT",
      context.incidentId(),
      AuditOutcome.SUCCESS,
      "Mock provider generated a provider-neutral advisory proposal."
    );

    return proposal;
  }
}
