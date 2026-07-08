import { buildGuidedRecommendations } from './agent-recommendation';
import { AgentToolResult } from './agent-tool';
import { AgentSessionSnapshot } from './agentic-ui';

const snapshot: AgentSessionSnapshot = {
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

const toolResult: AgentToolResult = {
  id: 'agent-session-INC-001:read-selected-incident:now',
  sessionId: 'agent-session-INC-001',
  toolName: 'read-selected-incident',
  title: 'Read selected incident',
  summary: 'Selected incident INC-001 is Open.',
  permission: 'read-only',
  facts: ['Severity: Critical.', 'Priority: P1.'],
  at: '2026-07-07T09:00:00.000Z',
};

describe('buildGuidedRecommendations', () => {
  it('recommends local context checks before tools have run', () => {
    const recommendations = buildGuidedRecommendations(snapshot);

    expect(recommendations.map((recommendation) => recommendation.title)).toContain(
      'Run local context checks',
    );
    expect(recommendations.map((recommendation) => recommendation.title)).toContain(
      'Keep approval boundary visible',
    );
  });

  it('escalates critical selected incident context from tool results', () => {
    const recommendations = buildGuidedRecommendations(snapshot, [toolResult]);

    expect(recommendations).toContainEqual(
      expect.objectContaining({
        title: 'Treat selected incident as high attention',
        priority: 'escalate',
      }),
    );
  });
});
