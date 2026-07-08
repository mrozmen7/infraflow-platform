import {
  AgentApprovalDecisionValue,
  AgentApprovalRequest,
} from './agent-approval';
import { AgentRenderBlock } from './agent-render-block';
import { AgentSafetyEvaluation } from './agent-safety-evaluation';
import { AgentToolResult } from './agent-tool';
import { AgentActionCard, AgentSessionSnapshot } from './agentic-ui';

export const agentEventTypes = [
  'session-started',
  'context-loaded',
  'action-card-proposed',
  'action-card-selected',
  'approval-required',
  'assistant-message',
  'tool-called',
  'tool-result-received',
  'ui-block-rendered',
  'approval-requested',
  'approval-approved',
  'approval-rejected',
  'safety-evaluated',
  'error-recorded',
] as const;

export type AgentEventType = (typeof agentEventTypes)[number];

export type AgentEventSource = 'system' | 'assistant' | 'operator' | 'tool';

export type AgentSessionStatus =
  | 'idle'
  | 'active'
  | 'awaiting-approval'
  | 'completed'
  | 'error';

export type AgentMessageRole = 'system' | 'assistant' | 'operator';

export interface AgentEvent {
  readonly id: string;
  readonly type: AgentEventType;
  readonly source: AgentEventSource;
  readonly sessionId: string;
  readonly at: string;
  readonly summary: string;
  readonly cardId?: string;
  readonly toolName?: string;
  readonly renderBlockId?: string;
  readonly approvalRequestId?: string;
  readonly safetyStatus?: AgentSafetyEvaluation['status'];
  readonly requiresApproval?: boolean;
}

export interface AgentMessage {
  readonly id: string;
  readonly role: AgentMessageRole;
  readonly at: string;
  readonly text: string;
}

export interface AgentSessionState {
  readonly id: string;
  readonly status: AgentSessionStatus;
  readonly events: readonly AgentEvent[];
  readonly messages: readonly AgentMessage[];
  readonly selectedCardId: string | null;
  readonly pendingApprovalCardId: string | null;
  readonly lastUpdatedAt: string | null;
}

export function createInitialAgentSessionState(sessionId: string): AgentSessionState {
  return {
    id: sessionId,
    status: 'idle',
    events: [],
    messages: [],
    selectedCardId: null,
    pendingApprovalCardId: null,
    lastUpdatedAt: null,
  };
}

export function createAgentSessionStateFromSnapshot(
  snapshot: AgentSessionSnapshot,
  extraEvents: readonly AgentEvent[] = [],
): AgentSessionState {
  const baselineEvents = createSnapshotEvents(snapshot);
  const sessionEvents = extraEvents.filter((event) => event.sessionId === snapshot.id);

  return [...baselineEvents, ...sessionEvents].reduce(
    reduceAgentEvent,
    createInitialAgentSessionState(snapshot.id),
  );
}

export function createAgentCardSelectedEvent(
  snapshot: AgentSessionSnapshot,
  card: AgentActionCard,
  at: string,
): AgentEvent {
  return {
    id: `${snapshot.id}:action-card-selected:${card.id}:${at}`,
    type: 'action-card-selected',
    source: 'operator',
    sessionId: snapshot.id,
    at,
    summary: `Action selected: ${card.title}`,
    cardId: card.id,
    requiresApproval: card.requiresApproval,
  };
}

export function createAgentToolEvents(
  snapshot: AgentSessionSnapshot,
  results: readonly AgentToolResult[],
): readonly AgentEvent[] {
  return results.flatMap((result) => [
    {
      id: `${result.id}:tool-called`,
      type: 'tool-called',
      source: 'assistant',
      sessionId: snapshot.id,
      at: result.at,
      summary: `Tool called: ${result.title}`,
      toolName: result.toolName,
    },
    {
      id: `${result.id}:tool-result-received`,
      type: 'tool-result-received',
      source: 'tool',
      sessionId: snapshot.id,
      at: result.at,
      summary: `Tool result: ${result.summary}`,
      toolName: result.toolName,
    },
  ]);
}

export function createAgentRenderBlockEvents(
  snapshot: AgentSessionSnapshot,
  renderBlocks: readonly AgentRenderBlock[],
  at: string,
): readonly AgentEvent[] {
  return renderBlocks.map((block) => ({
    id: `${snapshot.id}:ui-block-rendered:${block.id}:${at}`,
    type: 'ui-block-rendered',
    source: 'assistant',
    sessionId: snapshot.id,
    at,
    summary: `UI block rendered: ${block.title}`,
    renderBlockId: block.id,
  }));
}

export function createAgentApprovalRequestedEvent(
  snapshot: AgentSessionSnapshot,
  request: AgentApprovalRequest,
): AgentEvent {
  return {
    id: `${request.id}:approval-requested:${request.requestedAt}`,
    type: 'approval-requested',
    source: 'assistant',
    sessionId: snapshot.id,
    at: request.requestedAt,
    summary: `Approval requested: ${request.title}`,
    cardId: request.cardId,
    approvalRequestId: request.id,
    requiresApproval: true,
  };
}

export function createAgentApprovalDecisionEvent(
  snapshot: AgentSessionSnapshot,
  request: AgentApprovalRequest,
  decision: AgentApprovalDecisionValue,
): AgentEvent {
  return {
    id: `${request.id}:approval-${decision}:${request.decidedAt ?? request.requestedAt}`,
    type: decision === 'approved' ? 'approval-approved' : 'approval-rejected',
    source: 'operator',
    sessionId: snapshot.id,
    at: request.decidedAt ?? request.requestedAt,
    summary: `Approval ${decision}: ${request.title}`,
    cardId: request.cardId,
    approvalRequestId: request.id,
  };
}

export function createAgentSafetyEvaluatedEvent(
  snapshot: AgentSessionSnapshot,
  evaluation: AgentSafetyEvaluation,
  at: string,
): AgentEvent {
  return {
    id: `${evaluation.id}:safety-evaluated:${at}`,
    type: 'safety-evaluated',
    source: 'system',
    sessionId: snapshot.id,
    at,
    summary: `Safety evaluation ${evaluation.status} with score ${evaluation.score}.`,
    safetyStatus: evaluation.status,
  };
}

export function reduceAgentEvent(
  state: AgentSessionState,
  event: AgentEvent,
): AgentSessionState {
  const selectedCardId =
    event.type === 'action-card-selected' && event.cardId
      ? event.cardId
      : state.selectedCardId;
  const pendingApprovalCardId = nextPendingApprovalCardId(state, event);

  return {
    ...state,
    status: nextSessionStatus(state, event),
    events: [...state.events, event],
    messages: appendMessage(state.messages, event),
    selectedCardId,
    pendingApprovalCardId,
    lastUpdatedAt: event.at,
  };
}

function createSnapshotEvents(snapshot: AgentSessionSnapshot): readonly AgentEvent[] {
  const events: AgentEvent[] = [
    {
      id: `${snapshot.id}:session-started`,
      type: 'session-started',
      source: 'system',
      sessionId: snapshot.id,
      at: snapshot.generatedAt,
      summary: `${snapshot.title} session started.`,
    },
    {
      id: `${snapshot.id}:context-loaded`,
      type: 'context-loaded',
      source: 'system',
      sessionId: snapshot.id,
      at: snapshot.generatedAt,
      summary: `${snapshot.context.length} context items loaded.`,
    },
  ];

  for (const card of snapshot.cards) {
    events.push({
      id: `${snapshot.id}:action-card-proposed:${card.id}`,
      type: 'action-card-proposed',
      source: 'assistant',
      sessionId: snapshot.id,
      at: snapshot.generatedAt,
      summary: `Action card proposed: ${card.title}`,
      cardId: card.id,
      requiresApproval: card.requiresApproval,
    });

    if (card.requiresApproval) {
      events.push({
        id: `${snapshot.id}:approval-required:${card.id}`,
        type: 'approval-required',
        source: 'assistant',
        sessionId: snapshot.id,
        at: snapshot.generatedAt,
        summary: `Approval required: ${card.title}`,
        cardId: card.id,
        requiresApproval: true,
      });
    }
  }

  return events;
}

function nextSessionStatus(
  state: AgentSessionState,
  event: AgentEvent,
): AgentSessionStatus {
  if (event.type === 'error-recorded') {
    return 'error';
  }

  if (event.type === 'approval-required') {
    return 'awaiting-approval';
  }

  if (event.type === 'action-card-selected' && event.requiresApproval) {
    return 'awaiting-approval';
  }

  if (event.type === 'approval-requested') {
    return 'awaiting-approval';
  }

  if (event.type === 'approval-approved' || event.type === 'approval-rejected') {
    return 'active';
  }

  if (state.status === 'idle' && event.type === 'session-started') {
    return 'active';
  }

  return state.status === 'idle' ? 'active' : state.status;
}

function nextPendingApprovalCardId(
  state: AgentSessionState,
  event: AgentEvent,
): string | null {
  if ((event.type === 'approval-required' || event.requiresApproval) && event.cardId) {
    return event.cardId;
  }

  if (
    (event.type === 'approval-approved' || event.type === 'approval-rejected') &&
    event.cardId === state.pendingApprovalCardId
  ) {
    return null;
  }

  return state.pendingApprovalCardId;
}

function appendMessage(
  messages: readonly AgentMessage[],
  event: AgentEvent,
): readonly AgentMessage[] {
  if (
    event.type !== 'assistant-message' &&
    event.type !== 'action-card-selected' &&
    event.type !== 'tool-result-received' &&
    event.type !== 'approval-requested' &&
    event.type !== 'approval-approved' &&
    event.type !== 'approval-rejected' &&
    event.type !== 'safety-evaluated'
  ) {
    return messages;
  }

  return [
    ...messages,
    {
      id: `${event.id}:message`,
      role:
        event.source === 'operator'
          ? 'operator'
          : event.source === 'system'
            ? 'system'
            : 'assistant',
      at: event.at,
      text: event.summary,
    },
  ];
}
