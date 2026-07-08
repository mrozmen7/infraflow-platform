import { AgentApprovalRequest } from './agent-approval';
import { AgentRecommendation } from './agent-recommendation';
import { AgentToolResult } from './agent-tool';

export const agentRenderBlockTypes = [
  'recommendation-card',
  'approval-request',
  'tool-result-summary',
  'safety-status',
] as const;

export type AgentRenderBlockType = (typeof agentRenderBlockTypes)[number];
export type AgentRenderBlockVariant = 'neutral' | 'info' | 'warning' | 'danger';
export type AgentRenderBlockActionIntent = 'review' | 'approve' | 'reject' | 'run-tools';

export interface AgentRenderBlockAction {
  readonly id: string;
  readonly label: string;
  readonly intent: AgentRenderBlockActionIntent;
  readonly disabled?: boolean;
}

export interface AgentRenderBlock {
  readonly id: string;
  readonly type: AgentRenderBlockType;
  readonly title: string;
  readonly body: string;
  readonly variant: AgentRenderBlockVariant;
  readonly facts: readonly string[];
  readonly actions: readonly AgentRenderBlockAction[];
}

export interface AgentRenderBlockInput {
  readonly recommendations: readonly AgentRecommendation[];
  readonly toolResults: readonly AgentToolResult[];
  readonly approvalRequests: readonly AgentApprovalRequest[];
}

export function buildAgentRenderBlocks({
  recommendations,
  toolResults,
  approvalRequests,
}: AgentRenderBlockInput): readonly AgentRenderBlock[] {
  return [
    ...recommendations.map(recommendationToBlock),
    ...toolResults.map(toolResultToBlock),
    ...approvalRequests.map(approvalRequestToBlock),
  ].filter(isAllowedAgentRenderBlock);
}

export function isAllowedAgentRenderBlock(block: AgentRenderBlock): boolean {
  return agentRenderBlockTypes.includes(block.type);
}

function recommendationToBlock(recommendation: AgentRecommendation): AgentRenderBlock {
  return {
    id: `${recommendation.id}:block`,
    type: 'recommendation-card',
    title: recommendation.title,
    body: recommendation.summary,
    variant: priorityToVariant(recommendation.priority),
    facts: recommendation.evidence,
    actions: [
      {
        id: `${recommendation.id}:review`,
        label: 'Review guidance',
        intent: 'review',
      },
    ],
  };
}

function toolResultToBlock(result: AgentToolResult): AgentRenderBlock {
  return {
    id: `${result.id}:block`,
    type: 'tool-result-summary',
    title: result.title,
    body: result.summary,
    variant: 'info',
    facts: result.facts,
    actions: [],
  };
}

function approvalRequestToBlock(request: AgentApprovalRequest): AgentRenderBlock {
  return {
    id: `${request.id}:block`,
    type: 'approval-request',
    title: request.title,
    body: request.summary,
    variant: request.status === 'pending' ? 'warning' : 'neutral',
    facts: request.evidence,
    actions: [
      {
        id: `${request.id}:approve`,
        label: 'Approve',
        intent: 'approve',
        disabled: request.status !== 'pending',
      },
      {
        id: `${request.id}:reject`,
        label: 'Reject',
        intent: 'reject',
        disabled: request.status !== 'pending',
      },
    ],
  };
}

function priorityToVariant(priority: AgentRecommendation['priority']): AgentRenderBlockVariant {
  switch (priority) {
    case 'escalate':
      return 'danger';
    case 'review':
      return 'warning';
    case 'observe':
      return 'info';
  }
}
