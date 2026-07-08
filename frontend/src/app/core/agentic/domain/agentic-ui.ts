export const agentRiskLevels = ['low', 'medium', 'high', 'critical'] as const;

export type AgentRiskLevel = (typeof agentRiskLevels)[number];

export type AgentUiMode = 'advisory' | 'approval-required' | 'automation-disabled';

export type AgentActionIntent =
  | 'inspect-context'
  | 'acknowledge-ownership'
  | 'start-response'
  | 'create-work-order'
  | 'request-approval'
  | 'open-record';

export type AgentActionTargetType = 'incident' | 'asset' | 'work-order';

export interface AgentContextItem {
  readonly label: string;
  readonly value: string;
}

export interface AgentActionCard {
  readonly id: string;
  readonly title: string;
  readonly summary: string;
  readonly intent: AgentActionIntent;
  readonly targetType: AgentActionTargetType;
  readonly targetId: string;
  readonly riskLevel: AgentRiskLevel;
  readonly requiresApproval: boolean;
  readonly evidence: readonly string[];
  readonly disabledReason?: string;
}

export interface AgentSessionSnapshot {
  readonly id: string;
  readonly title: string;
  readonly subtitle: string;
  readonly mode: AgentUiMode;
  readonly context: readonly AgentContextItem[];
  readonly cards: readonly AgentActionCard[];
  readonly safetyNotes: readonly string[];
  readonly generatedAt: string;
}

export function isHighRiskAgentAction(card: AgentActionCard): boolean {
  return card.riskLevel === 'high' || card.riskLevel === 'critical';
}
