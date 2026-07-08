import {
  createApprovalRequestFromCard,
  decideApprovalRequest,
} from './agent-approval';
import { AgentActionCard, AgentSessionSnapshot } from './agentic-ui';

const card: AgentActionCard = {
  id: 'INC-001-work-order',
  title: 'Draft a work order',
  summary: 'Create a controlled work order draft.',
  intent: 'create-work-order',
  targetType: 'incident',
  targetId: 'INC-001',
  riskLevel: 'medium',
  requiresApproval: true,
  evidence: ['A work order affects field team execution.'],
};

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

describe('agent approval', () => {
  it('creates a pending approval request from an action card', () => {
    const request = createApprovalRequestFromCard(
      snapshot,
      card,
      '2026-07-07T09:00:00.000Z',
    );

    expect(request).toEqual({
      id: 'agent-session-INC-001:approval:INC-001-work-order',
      sessionId: 'agent-session-INC-001',
      cardId: 'INC-001-work-order',
      title: 'Draft a work order',
      summary: 'Create a controlled work order draft.',
      riskLevel: 'medium',
      status: 'pending',
      evidence: ['A work order affects field team execution.'],
      requestedAt: '2026-07-07T09:00:00.000Z',
    });
  });

  it('records an explicit operator decision without changing the original request', () => {
    const request = createApprovalRequestFromCard(
      snapshot,
      card,
      '2026-07-07T09:00:00.000Z',
    );

    const decidedRequest = decideApprovalRequest(
      request,
      'approved',
      '2026-07-07T09:05:00.000Z',
      'shift-lead',
      'Reviewed by supervisor.',
    );

    expect(request.status).toBe('pending');
    expect(decidedRequest.status).toBe('approved');
    expect(decidedRequest.decidedBy).toBe('shift-lead');
    expect(decidedRequest.rationale).toBe('Reviewed by supervisor.');
  });
});
