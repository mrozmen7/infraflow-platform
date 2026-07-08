import { evaluateAgentSafety } from './agent-safety-evaluation';
import { AgentSessionSnapshot } from './agentic-ui';

const safeSnapshot: AgentSessionSnapshot = {
  id: 'agent-session-INC-001',
  title: 'Operations assistant',
  subtitle: 'Advisory support',
  mode: 'approval-required',
  context: [],
  cards: [
    {
      id: 'INC-001-supervisor',
      title: 'Request supervisor approval',
      summary: 'Escalate the critical incident.',
      intent: 'request-approval',
      targetType: 'incident',
      targetId: 'INC-001',
      riskLevel: 'critical',
      requiresApproval: true,
      evidence: ['Critical severity requires explicit human approval.'],
    },
  ],
  safetyNotes: [],
  generatedAt: '2026-07-07T00:00:00.000Z',
};

describe('evaluateAgentSafety', () => {
  it('marks unrevewed approval cards for review instead of passing silently', () => {
    const evaluation = evaluateAgentSafety({
      snapshot: safeSnapshot,
      toolResults: [],
      renderBlocks: [],
      approvalRequests: [],
    });

    expect(evaluation?.status).toBe('review');
    expect(evaluation?.checks).toContainEqual(
      expect.objectContaining({
        id: 'approval-coverage',
        status: 'review',
      }),
    );
  });

  it('fails when a high-risk card does not require approval', () => {
    const evaluation = evaluateAgentSafety({
      snapshot: {
        ...safeSnapshot,
        cards: [{ ...safeSnapshot.cards[0], requiresApproval: false }],
      },
      toolResults: [],
      renderBlocks: [],
      approvalRequests: [],
    });

    expect(evaluation?.status).toBe('fail');
  });
});
