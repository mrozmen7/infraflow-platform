import { Component, computed, input, output } from '@angular/core';

import {
  AgentActionCard,
  AgentApprovalDecisionValue,
  AgentApprovalRequest,
  AgentProtocolEvent,
  AgentRecommendation,
  AgentRenderBlock,
  AgentSafetyEvaluation,
  AgentSessionState,
  AgentSessionSnapshot,
  AgentToolResult,
  isHighRiskAgentAction,
} from '../../../../core/agentic/domain';

@Component({
  selector: 'app-incident-agent-panel',
  templateUrl: './incident-agent-panel.html',
  styleUrl: './incident-agent-panel.scss',
})
export class IncidentAgentPanel {
  readonly snapshot = input<AgentSessionSnapshot | null>(null);
  readonly loading = input(false);
  readonly errorMessage = input('');
  readonly sessionState = input<AgentSessionState | null>(null);
  readonly toolResults = input<readonly AgentToolResult[]>([]);
  readonly recommendations = input<readonly AgentRecommendation[]>([]);
  readonly renderBlocks = input<readonly AgentRenderBlock[]>([]);
  readonly approvalRequests = input<readonly AgentApprovalRequest[]>([]);
  readonly safetyEvaluation = input<AgentSafetyEvaluation | null>(null);
  readonly protocolEvents = input<readonly AgentProtocolEvent[]>([]);
  readonly cardSelected = output<AgentActionCard>();
  readonly toolsRequested = output<void>();
  readonly approvalDecisionRequested = output<{
    readonly requestId: string;
    readonly decision: AgentApprovalDecisionValue;
  }>();

  protected readonly modeLabel = computed(() => {
    switch (this.snapshot()?.mode) {
      case 'approval-required':
        return 'Approval required';
      case 'automation-disabled':
        return 'Automation disabled';
      case 'advisory':
        return 'Advisory only';
      default:
        return 'Waiting for selection';
    }
  });

  protected readonly isHighRisk = isHighRiskAgentAction;
  protected readonly recentEvents = computed(() => this.sessionState()?.events.slice(-12) ?? []);
  protected readonly pendingApprovalRequests = computed(() =>
    this.approvalRequests().filter((request) => request.status === 'pending'),
  );
  protected readonly protocolSummary = computed(() => {
    const eventCount = this.protocolEvents().length;
    return eventCount === 1 ? '1 protocol event ready.' : `${eventCount} protocol events ready.`;
  });

  protected readonly statusLabel = computed(() => {
    switch (this.sessionState()?.status) {
      case 'awaiting-approval':
        return 'Awaiting approval';
      case 'active':
        return 'Active';
      case 'completed':
        return 'Completed';
      case 'error':
        return 'Error';
      case 'idle':
        return 'Idle';
      default:
        return 'No session';
    }
  });

  protected selectCard(card: AgentActionCard): void {
    if (card.disabledReason) {
      return;
    }

    this.cardSelected.emit(card);
  }

  protected requestTools(): void {
    this.toolsRequested.emit();
  }

  protected decideApproval(
    request: AgentApprovalRequest,
    decision: AgentApprovalDecisionValue,
  ): void {
    this.approvalDecisionRequested.emit({
      requestId: request.id,
      decision,
    });
  }
}
