import { createApprovalRequestFromCard } from './agent-approval';
import { buildAgentRenderBlocks, isAllowedAgentRenderBlock } from './agent-render-block';
import { AgentRecommendation } from './agent-recommendation';
import { AgentSessionSnapshot } from './agentic-ui';

const card = {
  id: 'INC-001-work-order',
  title: 'Draft a work order',
  summary: 'Create a controlled work order draft.',
  intent: 'create-work-order',
  targetType: 'incident',
  targetId: 'INC-001',
  riskLevel: 'medium',
  requiresApproval: true,
  evidence: ['A work order affects field team execution.'],
} as const;

const snapshot: AgentSessionSnapshot = {
  id: 'agent-session-INC-001',
  title: 'Operations assistant',
  subtitle: 'Advisory support',
  mode: 'approval-required',
  context: [],
  cards: [card],
  safetyNotes: [],
  generatedAt: '2026-07-07T00:00:00.000Z',
};

const recommendation: AgentRecommendation = {
  id: 'agent-session-INC-001:recommendation:approval-boundary',
  title: 'Keep approval boundary visible',
  summary: 'One action needs explicit human approval.',
  priority: 'review',
  evidence: ['Draft a work order: medium.'],
  source: 'snapshot',
};

describe('buildAgentRenderBlocks', () => {
  it('maps recommendations and approval requests to allowed UI blocks', () => {
    const request = createApprovalRequestFromCard(
      snapshot,
      card,
      '2026-07-07T09:00:00.000Z',
    );
    const blocks = buildAgentRenderBlocks({
      recommendations: [recommendation],
      toolResults: [],
      approvalRequests: [request],
    });

    expect(blocks).toHaveLength(2);
    expect(blocks.every(isAllowedAgentRenderBlock)).toBe(true);
    expect(blocks.map((block) => block.type)).toEqual([
      'recommendation-card',
      'approval-request',
    ]);
  });
});
