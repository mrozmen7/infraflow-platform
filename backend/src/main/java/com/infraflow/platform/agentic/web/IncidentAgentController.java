package com.infraflow.platform.agentic.web;

import com.infraflow.platform.agentic.application.IncidentAgentProposal;
import com.infraflow.platform.agentic.application.IncidentAgentService;
import com.infraflow.platform.shared.kernel.IncidentId;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.Pattern;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Validated @RestController @RequestMapping("/api/v1/agent-sessions")
@Tag(name = "Agent sessions", description = "Provider-neutral advisory sessions; no LLM is called.")
class IncidentAgentController {
  private final IncidentAgentService agentService;
  IncidentAgentController(IncidentAgentService agentService) { this.agentService = agentService; }
  @GetMapping("/incidents/{incidentId}") @PreAuthorize("hasAnyRole('OPERATOR', 'ADMIN')")
  @Operation(operationId = "proposeIncidentActions", summary = "Generate a mock, provider-neutral incident proposal")
  IncidentAgentProposal propose(@PathVariable @Pattern(regexp = "INC-\\d{4}-\\d{4}") String incidentId) { return agentService.propose(new IncidentId(incidentId)); }
}
