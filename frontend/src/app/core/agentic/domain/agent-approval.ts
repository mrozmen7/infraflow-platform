import { AgentActionCard, AgentRiskLevel, AgentSessionSnapshot } from './agentic-ui';

export const agentApprovalStatuses = ['pending', 'approved', 'rejected'] as const;
export type AgentApprovalStatus = (typeof agentApprovalStatuses)[number];

export type AgentApprovalDecisionValue = 'approved' | 'rejected';

export interface AgentApprovalRequest {
  readonly id: string;
  readonly sessionId: string;
  readonly cardId: string;
  readonly title: string;
  readonly summary: string;
  readonly riskLevel: AgentRiskLevel;
  readonly status: AgentApprovalStatus;
  readonly evidence: readonly string[];
  readonly requestedAt: string;
  readonly decidedAt?: string;
  readonly decidedBy?: string;
  readonly rationale?: string;
}

export interface AgentApprovalDecision {
  readonly requestId: string;
  readonly decision: AgentApprovalDecisionValue;
  readonly decidedAt: string;
  readonly decidedBy: string;
  readonly rationale: string;
}

export function createApprovalRequestFromCard(
  snapshot: AgentSessionSnapshot,
  card: AgentActionCard,
  requestedAt: string,
): AgentApprovalRequest {
  return {
    id: `${snapshot.id}:approval:${card.id}`,
    sessionId: snapshot.id,
    cardId: card.id,
    title: card.title,
    summary: card.summary,
    riskLevel: card.riskLevel,
    status: 'pending',
    evidence: card.evidence,
    requestedAt,
  };
}

export function decideApprovalRequest(
  request: AgentApprovalRequest,
  decision: AgentApprovalDecisionValue,
  decidedAt: string,
  decidedBy = 'operator',
  rationale = 'Operator reviewed the approval boundary.',
): AgentApprovalRequest {
  return {
    ...request,
    status: decision,
    decidedAt,
    decidedBy,
    rationale,
  };
}
