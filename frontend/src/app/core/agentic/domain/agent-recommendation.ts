import { AgentToolResult } from './agent-tool';
import { AgentSessionSnapshot } from './agentic-ui';

export const agentRecommendationPriorities = ['observe', 'review', 'escalate'] as const;
export type AgentRecommendationPriority = (typeof agentRecommendationPriorities)[number];

export interface AgentRecommendation {
  readonly id: string;
  readonly title: string;
  readonly summary: string;
  readonly priority: AgentRecommendationPriority;
  readonly evidence: readonly string[];
  readonly source: 'snapshot' | 'tool-result' | 'policy';
}

export function buildGuidedRecommendations(
  snapshot: AgentSessionSnapshot | null,
  toolResults: readonly AgentToolResult[] = [],
): readonly AgentRecommendation[] {
  if (!snapshot) {
    return [];
  }

  const recommendations: AgentRecommendation[] = [];
  const approvalCards = snapshot.cards.filter((card) => card.requiresApproval);
  const highRiskCards = snapshot.cards.filter(
    (card) => card.riskLevel === 'high' || card.riskLevel === 'critical',
  );

  if (toolResults.length === 0) {
    recommendations.push({
      id: `${snapshot.id}:recommendation:run-client-tools`,
      title: 'Run local context checks',
      summary: 'Use read-only browser-side tools before reviewing operational actions.',
      priority: 'observe',
      evidence: [
        'No tool result exists for this assistant session yet.',
        'Client-side tools read Angular state without mutating incident data.',
      ],
      source: 'policy',
    });
  }

  if (approvalCards.length > 0) {
    recommendations.push({
      id: `${snapshot.id}:recommendation:approval-boundary`,
      title: 'Keep approval boundary visible',
      summary: `${approvalCards.length} proposed actions need explicit human approval.`,
      priority: highRiskCards.length > 0 ? 'escalate' : 'review',
      evidence: approvalCards.map((card) => `${card.title}: ${card.riskLevel}.`),
      source: 'snapshot',
    });
  }

  const selectedIncidentResult = findToolResult(toolResults, 'read-selected-incident');
  const queueResult = findToolResult(toolResults, 'summarize-visible-queue');
  const approvalBoundaryResult = findToolResult(toolResults, 'inspect-approval-boundary');

  if (selectedIncidentResult && hasCriticalOrPriorityOneFact(selectedIncidentResult)) {
    recommendations.push({
      id: `${snapshot.id}:recommendation:selected-critical-context`,
      title: 'Treat selected incident as high attention',
      summary: 'The selected incident contains critical or P1 context and should stay operator-led.',
      priority: 'escalate',
      evidence: selectedIncidentResult.facts.filter(
        (fact) => fact.includes('Critical') || fact.includes('P1'),
      ),
      source: 'tool-result',
    });
  }

  if (queueResult && !queueResult.summary.includes('0 critical open')) {
    recommendations.push({
      id: `${snapshot.id}:recommendation:queue-critical-focus`,
      title: 'Keep the critical queue in focus',
      summary: queueResult.summary,
      priority: 'review',
      evidence: queueResult.facts,
      source: 'tool-result',
    });
  }

  if (approvalBoundaryResult) {
    recommendations.push({
      id: `${snapshot.id}:recommendation:mutation-disabled`,
      title: 'Do not execute mutations from the assistant panel',
      summary: 'Use the assistant panel for review and approval routing, not direct system changes.',
      priority: 'review',
      evidence: approvalBoundaryResult.facts.filter((fact) =>
        fact.toLowerCase().includes('cannot execute mutations') ||
        fact.toLowerCase().includes('authorization'),
      ),
      source: 'tool-result',
    });
  }

  return uniqueById(recommendations);
}

function findToolResult(
  toolResults: readonly AgentToolResult[],
  toolName: string,
): AgentToolResult | undefined {
  return toolResults.find((result) => result.toolName === toolName);
}

function hasCriticalOrPriorityOneFact(result: AgentToolResult): boolean {
  return result.facts.some((fact) => fact.includes('Severity: Critical') || fact.includes('Priority: P1'));
}

function uniqueById(recommendations: readonly AgentRecommendation[]): readonly AgentRecommendation[] {
  return [...new Map(recommendations.map((recommendation) => [recommendation.id, recommendation])).values()];
}
