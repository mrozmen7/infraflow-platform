import {
  AgentActionCard,
  AgentSessionSnapshot,
  AgentUiMode,
} from '../../../../core/agentic/domain';
import { Incident } from '../../domain/incident';

const GENERATED_AT = '2026-07-07T00:00:00.000Z';

export function buildIncidentAgentSnapshot(
  incident: Incident | null,
): AgentSessionSnapshot | null {
  if (!incident) {
    return null;
  }

  const cards = buildIncidentActionCards(incident);

  return {
    id: `agent-session-${incident.id}`,
    title: 'Operations assistant',
    subtitle: 'Advisory support for the selected incident',
    mode: determineMode(cards),
    context: [
      { label: 'Incident', value: incident.id },
      { label: 'Asset', value: incident.assetId },
      { label: 'Severity', value: incident.severity },
      { label: 'Priority', value: incident.priority },
      { label: 'Status', value: incident.status },
    ],
    cards,
    safetyNotes: [
      'The assistant can suggest actions, but the operator keeps control.',
      'Critical or irreversible actions must pass through an approval step.',
      'Frontend actions are treated as intents until the backend authorizes them.',
    ],
    generatedAt: GENERATED_AT,
  };
}

function buildIncidentActionCards(incident: Incident): readonly AgentActionCard[] {
  const cards: AgentActionCard[] = [
    {
      id: `${incident.id}-inspect-context`,
      title: 'Review operational context',
      summary: 'Check the selected incident, linked asset and current workflow state before acting.',
      intent: 'inspect-context',
      targetType: 'incident',
      targetId: incident.id,
      riskLevel: 'low',
      requiresApproval: false,
      evidence: [
        `Status is ${incident.status}.`,
        `The affected asset is ${incident.assetId}.`,
      ],
    },
  ];

  if (incident.status === 'Open') {
    cards.push({
      id: `${incident.id}-acknowledge-ownership`,
      title: 'Acknowledge operator ownership',
      summary: 'Mark that an operator has seen the incident before operational response starts.',
      intent: 'acknowledge-ownership',
      targetType: 'incident',
      targetId: incident.id,
      riskLevel: incident.severity === 'Critical' ? 'high' : 'medium',
      requiresApproval: incident.severity === 'Critical',
      evidence: [
        `Severity is ${incident.severity}.`,
        `Priority is ${incident.priority}.`,
        'Acknowledgement changes workflow visibility, not the physical asset state.',
      ],
    });
  }

  if (incident.status === 'Acknowledged') {
    cards.push({
      id: `${incident.id}-start-response`,
      title: 'Prepare response start',
      summary: 'Move from acknowledged ownership to active operational response.',
      intent: 'start-response',
      targetType: 'incident',
      targetId: incident.id,
      riskLevel: incident.severity === 'Critical' ? 'high' : 'medium',
      requiresApproval: incident.severity === 'Critical' || incident.priority === 'P1',
      evidence: [
        'The incident is already acknowledged.',
        `Current priority is ${incident.priority}.`,
        'Response start changes the workflow state and should be auditable.',
      ],
    });
  }

  if (incident.status !== 'Resolved') {
    cards.push({
      id: `${incident.id}-work-order-draft`,
      title: 'Draft a work order',
      summary: 'Create a controlled work order draft from the incident context.',
      intent: 'create-work-order',
      targetType: 'incident',
      targetId: incident.id,
      riskLevel: 'medium',
      requiresApproval: true,
      evidence: [
        `Location: ${incident.location}.`,
        `Operational signals: ${incident.operationalSignals.join(', ') || 'none'}.`,
        'A work order can affect field team execution and must be reviewed.',
      ],
    });
  }

  if (incident.severity === 'Critical' && incident.status !== 'Resolved') {
    cards.push({
      id: `${incident.id}-supervisor-approval`,
      title: 'Request supervisor approval',
      summary: 'Escalate the critical incident before any high-impact action is executed.',
      intent: 'request-approval',
      targetType: 'incident',
      targetId: incident.id,
      riskLevel: 'critical',
      requiresApproval: true,
      evidence: [
        'Critical severity requires explicit human approval.',
        'The assistant must not execute this class of action directly.',
      ],
    });
  }

  return cards;
}

function determineMode(cards: readonly AgentActionCard[]): AgentUiMode {
  return cards.some((card) => card.requiresApproval) ? 'approval-required' : 'advisory';
}
