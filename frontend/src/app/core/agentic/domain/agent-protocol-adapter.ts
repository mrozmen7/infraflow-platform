import { AgentApprovalRequest } from './agent-approval';
import { AgentRecommendation } from './agent-recommendation';
import { AgentRenderBlock } from './agent-render-block';
import { AgentSafetyEvaluation } from './agent-safety-evaluation';
import { AgentSessionState } from './agent-session-state';
import { AgentToolResult } from './agent-tool';
import { AgentSessionSnapshot } from './agentic-ui';

export const agentProtocolEventTypes = [
  'state.snapshot',
  'state.event',
  'tool.result',
  'ui.block',
  'approval.requested',
  'safety.evaluated',
] as const;

export type AgentProtocolEventType = (typeof agentProtocolEventTypes)[number];

export interface AgentProtocolEvent {
  readonly id: string;
  readonly type: AgentProtocolEventType;
  readonly sessionId: string;
  readonly at: string;
  readonly payload: unknown;
}

export interface AgentProtocolAdapterInput {
  readonly snapshot: AgentSessionSnapshot;
  readonly sessionState: AgentSessionState;
  readonly toolResults: readonly AgentToolResult[];
  readonly recommendations: readonly AgentRecommendation[];
  readonly renderBlocks: readonly AgentRenderBlock[];
  readonly approvalRequests: readonly AgentApprovalRequest[];
  readonly safetyEvaluation: AgentSafetyEvaluation | null;
}

export function toAgentProtocolEvents({
  snapshot,
  sessionState,
  toolResults,
  recommendations,
  renderBlocks,
  approvalRequests,
  safetyEvaluation,
}: AgentProtocolAdapterInput): readonly AgentProtocolEvent[] {
  const at = sessionState.lastUpdatedAt ?? snapshot.generatedAt;

  return [
    {
      id: `${snapshot.id}:protocol:state.snapshot`,
      type: 'state.snapshot',
      sessionId: snapshot.id,
      at,
      payload: {
        id: snapshot.id,
        mode: snapshot.mode,
        contextCount: snapshot.context.length,
        cardCount: snapshot.cards.length,
      },
    },
    ...sessionState.events.slice(-8).map((event) => ({
      id: `${event.id}:protocol`,
      type: 'state.event' as const,
      sessionId: snapshot.id,
      at: event.at,
      payload: event,
    })),
    ...toolResults.map((result) => ({
      id: `${result.id}:protocol`,
      type: 'tool.result' as const,
      sessionId: snapshot.id,
      at: result.at,
      payload: result,
    })),
    ...renderBlocks.map((block) => ({
      id: `${block.id}:protocol`,
      type: 'ui.block' as const,
      sessionId: snapshot.id,
      at,
      payload: block,
    })),
    ...approvalRequests.map((request) => ({
      id: `${request.id}:protocol`,
      type: 'approval.requested' as const,
      sessionId: snapshot.id,
      at: request.requestedAt,
      payload: request,
    })),
    ...(safetyEvaluation
      ? [
          {
            id: `${safetyEvaluation.id}:protocol`,
            type: 'safety.evaluated' as const,
            sessionId: snapshot.id,
            at,
            payload: safetyEvaluation,
          },
        ]
      : []),
  ];
}
