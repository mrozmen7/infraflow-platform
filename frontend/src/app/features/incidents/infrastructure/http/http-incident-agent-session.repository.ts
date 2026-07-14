import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import {
  type AgentActionCard,
  type AgentActionIntent,
  type AgentRiskLevel,
  type AgentSessionSnapshot,
  type AgentUiMode,
} from '../../../../core/agentic/domain';
import type { AppRuntimeConfig } from '../../../../core/config/app-runtime-config';
import { IncidentAgentSessionPort } from '../../application/ports/incident-agent-session.port';
import type { Incident } from '../../domain/incident';

interface IncidentAgentProposalResponse {
  readonly sessionId: string;
  readonly provider: string;
  readonly mode: string;
  readonly incidentId: string;
  readonly recommendations: readonly AgentRecommendationResponse[];
  readonly guardrails: readonly string[];
}

interface AgentRecommendationResponse {
  readonly id: string;
  readonly priority: string;
  readonly title: string;
  readonly summary: string;
  readonly requiresApproval: boolean;
}

/** HTTP adapter for the Spring Boot provider-neutral agent proposal contract. */
export class HttpIncidentAgentSessionRepository extends IncidentAgentSessionPort {
  constructor(
    private readonly http: HttpClient,
    private readonly runtimeConfig: AppRuntimeConfig,
  ) {
    super();
  }

  async propose(incident: Incident, abortSignal?: AbortSignal): Promise<AgentSessionSnapshot> {
    if (abortSignal?.aborted) {
      throw abortSignal.reason;
    }

    const response = await firstValueFrom(
      this.http.get<IncidentAgentProposalResponse>(
        `${this.runtimeConfig.apiBaseUrl}/v1/agent-sessions/incidents/${incident.id}`,
      ),
    );

    return toAgentSessionSnapshot(response, incident);
  }
}

function toAgentSessionSnapshot(
  response: IncidentAgentProposalResponse,
  incident: Incident,
): AgentSessionSnapshot {
  if (response.incidentId !== incident.id) {
    throw new Error('Agent proposal incident context does not match the selected incident.');
  }

  const safetyNotes = response.guardrails.filter(isNonEmptyString);

  return {
    id: requireNonEmptyString(response.sessionId, 'sessionId'),
    title: 'Operations assistant',
    subtitle: `${requireNonEmptyString(response.provider, 'provider')} advisory session`,
    mode: toAgentUiMode(response.mode),
    context: [
      { label: 'Incident', value: incident.id },
      { label: 'Asset', value: incident.assetId },
      { label: 'Severity', value: incident.severity },
      { label: 'Priority', value: incident.priority },
      { label: 'Status', value: incident.status },
    ],
    cards: response.recommendations.map((recommendation) =>
      toAgentActionCard(recommendation, incident, safetyNotes),
    ),
    safetyNotes:
      safetyNotes.length > 0
        ? safetyNotes
        : ['Assistant output is advisory. Backend authorization remains authoritative.'],
    generatedAt: new Date().toISOString(),
  };
}

function toAgentActionCard(
  recommendation: AgentRecommendationResponse,
  incident: Incident,
  guardrails: readonly string[],
): AgentActionCard {
  return {
    id: `${incident.id}:${requireNonEmptyString(recommendation.id, 'recommendation id')}`,
    title: requireNonEmptyString(recommendation.title, 'recommendation title'),
    summary: requireNonEmptyString(recommendation.summary, 'recommendation summary'),
    intent: toAgentActionIntent(recommendation.id),
    targetType: 'incident',
    targetId: incident.id,
    riskLevel: toAgentRiskLevel(recommendation.priority),
    requiresApproval: recommendation.requiresApproval === true,
    evidence: [
      `Selected incident: ${incident.id}.`,
      `Linked asset: ${incident.assetId}.`,
      ...guardrails.slice(0, 2),
    ],
  };
}

function toAgentUiMode(value: string): AgentUiMode {
  if (value === 'advisory' || value === 'approval-required' || value === 'automation-disabled') {
    return value;
  }

  throw new Error(`Unsupported agent mode "${value}".`);
}

function toAgentRiskLevel(value: string): AgentRiskLevel {
  switch (value.toLowerCase()) {
    case 'low':
      return 'low';
    case 'medium':
      return 'medium';
    case 'high':
      return 'high';
    case 'critical':
      return 'critical';
    default:
      throw new Error(`Unsupported agent recommendation priority "${value}".`);
  }
}

function toAgentActionIntent(recommendationId: string): AgentActionIntent {
  switch (recommendationId) {
    case 'review-context':
      return 'inspect-context';
    case 'draft-work-order':
      return 'create-work-order';
    case 'supervisor-approval':
      return 'request-approval';
    default:
      throw new Error(`Unsupported agent recommendation "${recommendationId}".`);
  }
}

function requireNonEmptyString(value: string, field: string): string {
  if (!isNonEmptyString(value)) {
    throw new Error(`Agent proposal ${field} must be a non-empty string.`);
  }

  return value;
}

function isNonEmptyString(value: string): boolean {
  return value.trim().length > 0;
}
