import { toAgentProtocolEvents } from './agent-protocol-adapter';
import { createAgentSessionStateFromSnapshot } from './agent-session-state';
import { AgentSessionSnapshot } from './agentic-ui';

const snapshot: AgentSessionSnapshot = {
  id: 'agent-session-INC-001',
  title: 'Operations assistant',
  subtitle: 'Advisory support',
  mode: 'advisory',
  context: [{ label: 'Incident', value: 'INC-001' }],
  cards: [],
  safetyNotes: [],
  generatedAt: '2026-07-07T00:00:00.000Z',
};

describe('toAgentProtocolEvents', () => {
  it('adapts internal state into provider-neutral protocol events', () => {
    const events = toAgentProtocolEvents({
      snapshot,
      sessionState: createAgentSessionStateFromSnapshot(snapshot),
      toolResults: [],
      recommendations: [],
      renderBlocks: [],
      approvalRequests: [],
      safetyEvaluation: null,
    });

    expect(events[0]).toEqual(
      expect.objectContaining({
        type: 'state.snapshot',
        sessionId: 'agent-session-INC-001',
      }),
    );
    expect(events.map((event) => event.type)).toContain('state.event');
  });
});
