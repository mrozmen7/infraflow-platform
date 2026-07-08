import { AgentApprovalRequest } from './agent-approval';
import { AgentRenderBlock, isAllowedAgentRenderBlock } from './agent-render-block';
import { AgentToolResult } from './agent-tool';
import { AgentSessionSnapshot } from './agentic-ui';

export type AgentSafetyCheckStatus = 'pass' | 'review' | 'fail';
export type AgentSafetyEvaluationStatus = 'pass' | 'review' | 'fail';

export interface AgentSafetyCheck {
  readonly id: string;
  readonly title: string;
  readonly status: AgentSafetyCheckStatus;
  readonly message: string;
}

export interface AgentSafetyEvaluation {
  readonly id: string;
  readonly sessionId: string;
  readonly status: AgentSafetyEvaluationStatus;
  readonly score: number;
  readonly checks: readonly AgentSafetyCheck[];
}

export interface AgentSafetyEvaluationInput {
  readonly snapshot: AgentSessionSnapshot | null;
  readonly toolResults: readonly AgentToolResult[];
  readonly renderBlocks: readonly AgentRenderBlock[];
  readonly approvalRequests: readonly AgentApprovalRequest[];
}

export function evaluateAgentSafety({
  snapshot,
  toolResults,
  renderBlocks,
  approvalRequests,
}: AgentSafetyEvaluationInput): AgentSafetyEvaluation | null {
  if (!snapshot) {
    return null;
  }

  const checks: readonly AgentSafetyCheck[] = [
    checkToolPermissions(toolResults),
    checkHighRiskCards(snapshot),
    checkRenderBlocks(renderBlocks),
    checkApprovalCoverage(snapshot, approvalRequests),
  ];
  const failedCount = checks.filter((check) => check.status === 'fail').length;
  const reviewCount = checks.filter((check) => check.status === 'review').length;
  const status: AgentSafetyEvaluationStatus =
    failedCount > 0 ? 'fail' : reviewCount > 0 ? 'review' : 'pass';
  const score = Math.round((checks.filter((check) => check.status === 'pass').length / checks.length) * 100);

  return {
    id: `${snapshot.id}:safety-evaluation`,
    sessionId: snapshot.id,
    status,
    score,
    checks,
  };
}

function checkToolPermissions(toolResults: readonly AgentToolResult[]): AgentSafetyCheck {
  const unsafeTool = toolResults.find((result) => result.permission !== 'read-only');

  return {
    id: 'tool-permissions',
    title: 'Tool permissions',
    status: unsafeTool ? 'fail' : 'pass',
    message: unsafeTool
      ? `${unsafeTool.title} is not read-only.`
      : 'All client-side tool results are read-only.',
  };
}

function checkHighRiskCards(snapshot: AgentSessionSnapshot): AgentSafetyCheck {
  const unsafeCard = snapshot.cards.find(
    (card) =>
      (card.riskLevel === 'high' || card.riskLevel === 'critical') && !card.requiresApproval,
  );

  return {
    id: 'high-risk-approval',
    title: 'High-risk approval',
    status: unsafeCard ? 'fail' : 'pass',
    message: unsafeCard
      ? `${unsafeCard.title} is high-risk without approval.`
      : 'High-risk action cards require human approval.',
  };
}

function checkRenderBlocks(renderBlocks: readonly AgentRenderBlock[]): AgentSafetyCheck {
  const invalidBlock = renderBlocks.find((block) => !isAllowedAgentRenderBlock(block));

  return {
    id: 'render-block-schema',
    title: 'Render block schema',
    status: invalidBlock ? 'fail' : 'pass',
    message: invalidBlock
      ? `${invalidBlock.title} uses an unsupported render block type.`
      : 'Generated UI blocks use the allowed schema.',
  };
}

function checkApprovalCoverage(
  snapshot: AgentSessionSnapshot,
  approvalRequests: readonly AgentApprovalRequest[],
): AgentSafetyCheck {
  const approvalCardIds = snapshot.cards
    .filter((card) => card.requiresApproval)
    .map((card) => card.id);
  const pendingOrDecidedRequestCardIds = new Set(approvalRequests.map((request) => request.cardId));
  const uncoveredCards = approvalCardIds.filter((cardId) => !pendingOrDecidedRequestCardIds.has(cardId));

  if (approvalCardIds.length === 0) {
    return {
      id: 'approval-coverage',
      title: 'Approval coverage',
      status: 'pass',
      message: 'No approval-required action card exists in this session.',
    };
  }

  return {
    id: 'approval-coverage',
    title: 'Approval coverage',
    status: uncoveredCards.length > 0 ? 'review' : 'pass',
    message:
      uncoveredCards.length > 0
        ? `${uncoveredCards.length} approval-required cards have not been reviewed yet.`
        : 'Approval-required cards have an approval request record.',
  };
}
