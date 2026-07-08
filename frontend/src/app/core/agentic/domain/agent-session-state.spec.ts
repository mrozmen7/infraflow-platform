import {
  createAgentToolEvents,
  createAgentCardSelectedEvent,
  createAgentSessionStateFromSnapshot,
} from './agent-session-state';
import { AgentActionCard, AgentSessionSnapshot } from './agentic-ui';

const workOrderCard: AgentActionCard = {
  id: 'INC-001-work-order-draft',
  title: 'Draft a work order',
  summary: 'Create a controlled work order draft from the incident context.',
  intent: 'create-work-order',
  targetType: 'incident',
  targetId: 'INC-001',
  riskLevel: 'medium',
  requiresApproval: true,
  evidence: ['A work order can affect field execution.'],
};

const snapshot: AgentSessionSnapshot = {
  id: 'agent-session-INC-001',
  title: 'Operations assistant',
  subtitle: 'Advisory support for the selected incident',
  mode: 'approval-required',
  context: [
    { label: 'Incident', value: 'INC-001' },
    { label: 'Asset', value: 'TRF-001' },
  ],
  cards: [
    {
      id: 'INC-001-inspect-context',
      title: 'Review operational context',
      summary: 'Check the selected incident before acting.',
      intent: 'inspect-context',
      targetType: 'incident',
      targetId: 'INC-001',
      riskLevel: 'low',
      requiresApproval: false,
      evidence: ['Status is Open.'],
    },
    workOrderCard,
  ],
  safetyNotes: ['The operator keeps control.'],
  generatedAt: '2026-07-07T08:00:00.000Z',
};

describe('agent session state', () => {
  it('creates a timeline from the current Agent snapshot', () => {
    const state = createAgentSessionStateFromSnapshot(snapshot);

    expect(state.status).toBe('awaiting-approval');
    expect(state.events.map((event) => event.type)).toEqual([
      'session-started',
      'context-loaded',
      'action-card-proposed',
      'action-card-proposed',
      'approval-required',
    ]);
    expect(state.pendingApprovalCardId).toBe('INC-001-work-order-draft');
  });

  it('records selected action cards as operator intent without executing them', () => {
    const selectedEvent = createAgentCardSelectedEvent(
      snapshot,
      workOrderCard,
      '2026-07-07T08:01:00.000Z',
    );
    const state = createAgentSessionStateFromSnapshot(snapshot, [selectedEvent]);

    expect(state.selectedCardId).toBe('INC-001-work-order-draft');
    expect(state.pendingApprovalCardId).toBe('INC-001-work-order-draft');
    expect(state.messages).toContainEqual({
      id: `${selectedEvent.id}:message`,
      role: 'operator',
      at: '2026-07-07T08:01:00.000Z',
      text: 'Action selected: Draft a work order',
    });
  });

  it('records client-side tool calls and tool results in the session timeline', () => {
    const toolEvents = createAgentToolEvents(snapshot, [
      {
        id: 'agent-session-INC-001:read-selected-incident:2026-07-07T08:02:00.000Z',
        sessionId: 'agent-session-INC-001',
        toolName: 'read-selected-incident',
        title: 'Read selected incident',
        summary: 'Selected incident INC-001 is visible.',
        permission: 'read-only',
        facts: ['Status is Open.'],
        at: '2026-07-07T08:02:00.000Z',
      },
    ]);
    const state = createAgentSessionStateFromSnapshot(snapshot, toolEvents);

    expect(state.events.map((event) => event.type)).toContain('tool-called');
    expect(state.events.map((event) => event.type)).toContain('tool-result-received');
    expect(state.messages).toContainEqual({
      id: `${toolEvents[1].id}:message`,
      role: 'assistant',
      at: '2026-07-07T08:02:00.000Z',
      text: 'Tool result: Selected incident INC-001 is visible.',
    });
  });
});
