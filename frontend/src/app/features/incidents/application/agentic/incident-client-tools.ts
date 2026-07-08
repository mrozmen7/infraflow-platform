import {
  AgentSessionSnapshot,
  AgentToolDefinition,
  AgentToolResult,
} from '../../../../core/agentic/domain';
import { Incident } from '../../domain/incident';

export const incidentClientToolDefinitions = [
  {
    name: 'read-selected-incident',
    title: 'Read selected incident',
    description: 'Reads the currently selected incident context from Angular state.',
    executionLocation: 'client',
    permission: 'read-only',
  },
  {
    name: 'summarize-visible-queue',
    title: 'Summarize visible queue',
    description: 'Summarizes the incident rows currently loaded in the browser.',
    executionLocation: 'client',
    permission: 'read-only',
  },
  {
    name: 'inspect-approval-boundary',
    title: 'Inspect approval boundary',
    description: 'Checks which proposed action cards require human approval.',
    executionLocation: 'client',
    permission: 'read-only',
  },
] as const satisfies readonly AgentToolDefinition[];

export interface IncidentClientToolInput {
  readonly snapshot: AgentSessionSnapshot;
  readonly selectedIncident: Incident;
  readonly visibleIncidents: readonly Incident[];
  readonly at: string;
}

export function buildIncidentClientToolResults({
  snapshot,
  selectedIncident,
  visibleIncidents,
  at,
}: IncidentClientToolInput): readonly AgentToolResult[] {
  return [
    buildSelectedIncidentResult(snapshot, selectedIncident, at),
    buildVisibleQueueResult(snapshot, visibleIncidents, at),
    buildApprovalBoundaryResult(snapshot, at),
  ];
}

function buildSelectedIncidentResult(
  snapshot: AgentSessionSnapshot,
  incident: Incident,
  at: string,
): AgentToolResult {
  return {
    id: buildToolResultId(snapshot.id, 'read-selected-incident', at),
    sessionId: snapshot.id,
    toolName: 'read-selected-incident',
    title: 'Read selected incident',
    summary: `Selected incident ${incident.id} is ${incident.status}.`,
    permission: 'read-only',
    facts: [
      `Title: ${incident.title}.`,
      `Asset: ${incident.assetId}.`,
      `Severity: ${incident.severity}.`,
      `Priority: ${incident.priority}.`,
      `Status: ${incident.status}.`,
    ],
    at,
  };
}

function buildVisibleQueueResult(
  snapshot: AgentSessionSnapshot,
  incidents: readonly Incident[],
  at: string,
): AgentToolResult {
  const criticalOpenCount = incidents.filter(
    (incident) => incident.severity === 'Critical' && incident.status !== 'Resolved',
  ).length;
  const inProgressCount = incidents.filter((incident) => incident.status === 'In Progress').length;
  const acknowledgedCount = incidents.filter((incident) => incident.status === 'Acknowledged').length;

  return {
    id: buildToolResultId(snapshot.id, 'summarize-visible-queue', at),
    sessionId: snapshot.id,
    toolName: 'summarize-visible-queue',
    title: 'Summarize visible queue',
    summary: `${incidents.length} visible incidents, ${criticalOpenCount} critical open.`,
    permission: 'read-only',
    facts: [
      `Visible incidents: ${incidents.length}.`,
      `Critical open: ${criticalOpenCount}.`,
      `In progress: ${inProgressCount}.`,
      `Acknowledged: ${acknowledgedCount}.`,
    ],
    at,
  };
}

function buildApprovalBoundaryResult(
  snapshot: AgentSessionSnapshot,
  at: string,
): AgentToolResult {
  const approvalCards = snapshot.cards.filter((card) => card.requiresApproval);
  const approvalTitles = approvalCards.map((card) => card.title).join(', ') || 'none';

  return {
    id: buildToolResultId(snapshot.id, 'inspect-approval-boundary', at),
    sessionId: snapshot.id,
    toolName: 'inspect-approval-boundary',
    title: 'Inspect approval boundary',
    summary: `${approvalCards.length} proposed actions require human approval.`,
    permission: 'read-only',
    facts: [
      `Approval-required cards: ${approvalCards.length}.`,
      `Approval card titles: ${approvalTitles}.`,
      'Client-side tools cannot execute mutations.',
      'Backend authorization remains required for real system changes.',
    ],
    at,
  };
}

function buildToolResultId(sessionId: string, toolName: string, at: string): string {
  return `${sessionId}:${toolName}:${at}`;
}
