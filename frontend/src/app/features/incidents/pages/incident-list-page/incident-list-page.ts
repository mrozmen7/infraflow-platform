import { Component, computed, effect, inject, resource, signal, viewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';

import {
  AgentActionCard,
  AgentApprovalDecisionValue,
  AgentApprovalRequest,
  AgentEvent,
  AgentProtocolEvent,
  AgentToolResult,
  buildAgentRenderBlocks,
  buildGuidedRecommendations,
  createAgentApprovalDecisionEvent,
  createAgentApprovalRequestedEvent,
  createAgentCardSelectedEvent,
  createAgentRenderBlockEvents,
  createAgentSafetyEvaluatedEvent,
  createAgentSessionStateFromSnapshot,
  createAgentToolEvents,
  createApprovalRequestFromCard,
  decideApprovalRequest,
  evaluateAgentSafety,
  toAgentProtocolEvents,
} from '../../../../core/agentic/domain';
import { EmptyState } from '../../../../shared/ui/empty-state/empty-state';
import {
  buildIncidentClientToolResults,
  IncidentAgentSessionPort,
} from '../../application';
import { IncidentSeverityFilter } from '../../domain/incident';
import { IncidentStore } from '../../state/incident-store';
import { IncidentAgentPanel } from '../../ui/incident-agent-panel/incident-agent-panel';
import { IncidentFilterBar } from '../../ui/incident-filter-bar/incident-filter-bar';
import { IncidentInspector } from '../../ui/incident-inspector/incident-inspector';
import { IncidentList } from '../../ui/incident-list/incident-list';

@Component({
  selector: 'app-incident-list-page',
  imports: [
    EmptyState,
    IncidentAgentPanel,
    IncidentFilterBar,
    IncidentInspector,
    IncidentList,
    RouterLink,
  ],
  templateUrl: './incident-list-page.html',
  styleUrl: './incident-list-page.scss',
})
export class IncidentListPage {
  private readonly title = inject(Title);
  private readonly filterBar = viewChild(IncidentFilterBar);
  private readonly incidentAgentSession = inject(IncidentAgentSessionPort);

  protected readonly incidentStore = inject(IncidentStore);
  protected readonly actionMessage = signal('');
  protected readonly agentInteractionEvents = signal<readonly AgentEvent[]>([]);
  protected readonly agentToolResults = signal<readonly AgentToolResult[]>([]);
  protected readonly agentApprovalRequests = signal<readonly AgentApprovalRequest[]>([]);
  protected readonly activeIncidentCount = computed(
    () => this.incidentStore.incidents().filter((incident) => incident.status !== 'Resolved').length,
  );
  protected readonly criticalIncidentCount = computed(
    () =>
      this.incidentStore
        .incidents()
        .filter((incident) => incident.severity === 'Critical' && incident.status !== 'Resolved')
        .length,
  );
  protected readonly inProgressIncidentCount = computed(
    () =>
      this.incidentStore.incidents().filter((incident) => incident.status === 'In Progress').length,
  );
  protected readonly selectedIncident = computed(() => {
    const selectedIncidentId = this.incidentStore.selectedIncidentId();
    return (
      this.incidentStore.incidents().find((incident) => incident.id === selectedIncidentId) ?? null
    );
  });
  private readonly agentSessionResource = resource({
    params: () => this.selectedIncident() ?? undefined,
    loader: ({ params, abortSignal }) => this.incidentAgentSession.propose(params, abortSignal),
  });
  protected readonly agentSnapshot = computed(() =>
    this.agentSessionResource.hasValue() ? this.agentSessionResource.value() : null,
  );
  protected readonly agentSessionLoading = computed(() => this.agentSessionResource.isLoading());
  protected readonly agentSessionError = computed(() =>
    this.agentSessionResource.error()
      ? 'Decision support is temporarily unavailable. Review the incident directly and retry.'
      : '',
  );
  protected readonly agentSessionState = computed(() => {
    const snapshot = this.agentSnapshot();

    if (!snapshot) {
      return null;
    }

    return createAgentSessionStateFromSnapshot(snapshot, this.agentInteractionEvents());
  });
  protected readonly currentAgentToolResults = computed(() => {
    const snapshot = this.agentSnapshot();

    if (!snapshot) {
      return [];
    }

    return this.agentToolResults().filter((result) => result.sessionId === snapshot.id);
  });
  protected readonly currentApprovalRequests = computed(() => {
    const snapshot = this.agentSnapshot();

    if (!snapshot) {
      return [];
    }

    return this.agentApprovalRequests().filter((request) => request.sessionId === snapshot.id);
  });
  protected readonly agentRecommendations = computed(() =>
    buildGuidedRecommendations(this.agentSnapshot(), this.currentAgentToolResults()),
  );
  protected readonly agentRenderBlocks = computed(() =>
    buildAgentRenderBlocks({
      recommendations: this.agentRecommendations(),
      toolResults: this.currentAgentToolResults(),
      approvalRequests: this.currentApprovalRequests(),
    }),
  );
  protected readonly agentSafetyEvaluation = computed(() =>
    evaluateAgentSafety({
      snapshot: this.agentSnapshot(),
      toolResults: this.currentAgentToolResults(),
      renderBlocks: this.agentRenderBlocks(),
      approvalRequests: this.currentApprovalRequests(),
    }),
  );
  protected readonly agentProtocolEvents = computed<readonly AgentProtocolEvent[]>(() => {
    const snapshot = this.agentSnapshot();
    const sessionState = this.agentSessionState();

    if (!snapshot || !sessionState) {
      return [];
    }

    return toAgentProtocolEvents({
      snapshot,
      sessionState,
      toolResults: this.currentAgentToolResults(),
      recommendations: this.agentRecommendations(),
      renderBlocks: this.agentRenderBlocks(),
      approvalRequests: this.currentApprovalRequests(),
      safetyEvaluation: this.agentSafetyEvaluation(),
    });
  });

  private readonly updateDocumentTitle = effect(() => {
    if (!this.incidentStore.isLoading() && !this.incidentStore.errorMessage()) {
      this.title.setTitle(`${this.incidentStore.resultSummary()} · InfraFlow`);
    }
  });

  protected updateSearchTerm(searchTerm: string): void {
    this.incidentStore.setSearchTerm(searchTerm);
    this.actionMessage.set('');
  }

  protected updateSeverity(severity: IncidentSeverityFilter): void {
    this.incidentStore.setSeverityFilter(severity);
    this.actionMessage.set('');
  }

  protected resetFilters(): void {
    this.incidentStore.resetFilters();
    this.actionMessage.set('Filters reset.');
    this.filterBar()?.focusSearch();
  }

  protected selectIncident(incidentId: string): void {
    this.incidentStore.selectIncident(incidentId);
    this.actionMessage.set(`${incidentId} selected for operational review.`);
  }

  protected async acknowledgeIncident(incidentId: string): Promise<void> {
    this.actionMessage.set(`Acknowledging ${incidentId}…`);

    try {
      await this.incidentStore.acknowledge(incidentId);
      this.actionMessage.set(`${incidentId} acknowledged by the operator.`);
    } catch {
      this.actionMessage.set(`${incidentId} could not be acknowledged.`);
    }
  }

  protected async startIncidentResponse(incidentId: string): Promise<void> {
    this.actionMessage.set(`Starting response for ${incidentId}…`);

    try {
      await this.incidentStore.startResponse(incidentId);
      this.actionMessage.set(`${incidentId} response started by the operator.`);
    } catch {
      this.actionMessage.set(`${incidentId} response could not be started.`);
    }
  }

  protected reviewAgentAction(card: AgentActionCard): void {
    const approvalMessage = card.requiresApproval
      ? 'Approval path will be reviewed before execution.'
      : 'Operator remains in control before execution.';
    const snapshot = this.agentSnapshot();

    if (snapshot) {
      const at = new Date().toISOString();
      const nextEvents: AgentEvent[] = [
        createAgentCardSelectedEvent(snapshot, card, at),
      ];

      if (card.requiresApproval) {
        const existingRequest = this.currentApprovalRequests().find(
          (request) => request.cardId === card.id && request.status === 'pending',
        );
        const request =
          existingRequest ?? createApprovalRequestFromCard(snapshot, card, at);

        if (!existingRequest) {
          this.agentApprovalRequests.update((requests) => [...requests, request]);
        }

        nextEvents.push(createAgentApprovalRequestedEvent(snapshot, request));
      }

      this.agentInteractionEvents.update((currentEvents) => [
        ...currentEvents,
        ...nextEvents,
      ]);
    }

    this.actionMessage.set(`${card.title} selected. ${approvalMessage}`);
  }

  protected reviewAgentApproval(
    requestId: string,
    decision: AgentApprovalDecisionValue,
  ): void {
    const snapshot = this.agentSnapshot();
    const request = this.currentApprovalRequests().find(
      (approvalRequest) => approvalRequest.id === requestId,
    );

    if (!snapshot || !request || request.status !== 'pending') {
      this.actionMessage.set('Approval request is no longer pending.');
      return;
    }

    const decidedRequest = decideApprovalRequest(request, decision, new Date().toISOString());

    this.agentApprovalRequests.update((requests) =>
      requests.map((currentRequest) =>
        currentRequest.id === decidedRequest.id ? decidedRequest : currentRequest,
      ),
    );
    this.agentInteractionEvents.update((events) => [
      ...events,
      createAgentApprovalDecisionEvent(snapshot, decidedRequest, decision),
    ]);
    this.actionMessage.set(`${decidedRequest.title} approval ${decision}.`);
  }

  protected runClientTools(): void {
    const snapshot = this.agentSnapshot();
    const selectedIncident = this.selectedIncident();

    if (!snapshot || !selectedIncident) {
      this.actionMessage.set('Client-side tools need a selected incident.');
      return;
    }

    const results = buildIncidentClientToolResults({
      snapshot,
      selectedIncident,
      visibleIncidents: this.incidentStore.incidents(),
      at: new Date().toISOString(),
    });

    const nextResults = [...this.agentToolResults(), ...results];
    this.agentToolResults.set(nextResults);

    const recommendations = buildGuidedRecommendations(
      snapshot,
      nextResults.filter((result) => result.sessionId === snapshot.id),
    );
    const renderBlocks = buildAgentRenderBlocks({
      recommendations,
      toolResults: nextResults.filter((result) => result.sessionId === snapshot.id),
      approvalRequests: this.currentApprovalRequests(),
    });
    const safetyEvaluation = evaluateAgentSafety({
      snapshot,
      toolResults: nextResults.filter((result) => result.sessionId === snapshot.id),
      renderBlocks,
      approvalRequests: this.currentApprovalRequests(),
    });
    const at = new Date().toISOString();
    this.agentInteractionEvents.update((events) => [
      ...events,
      ...createAgentToolEvents(snapshot, results),
      ...createAgentRenderBlockEvents(snapshot, renderBlocks, at),
      ...(safetyEvaluation
        ? [createAgentSafetyEvaluatedEvent(snapshot, safetyEvaluation, at)]
        : []),
    ]);
    this.actionMessage.set(`${results.length} read-only client-side tools completed.`);
  }

  protected retryLoading(): void {
    this.actionMessage.set('Retrying incident request…');
    this.incidentStore.reload();
  }
}
