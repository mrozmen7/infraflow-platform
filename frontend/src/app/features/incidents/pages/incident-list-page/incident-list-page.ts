import { Component, computed, effect, inject, signal, viewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';

import { EmptyState } from '../../../../shared/ui/empty-state/empty-state';
import { IncidentSeverityFilter } from '../../domain/incident';
import { IncidentStore } from '../../state/incident-store';
import { IncidentFilterBar } from '../../ui/incident-filter-bar/incident-filter-bar';
import { IncidentInspector } from '../../ui/incident-inspector/incident-inspector';
import { IncidentList } from '../../ui/incident-list/incident-list';

@Component({
  selector: 'app-incident-list-page',
  imports: [EmptyState, IncidentFilterBar, IncidentInspector, IncidentList, RouterLink],
  templateUrl: './incident-list-page.html',
  styleUrl: './incident-list-page.scss',
})
export class IncidentListPage {
  private readonly title = inject(Title);
  private readonly filterBar = viewChild(IncidentFilterBar);

  protected readonly incidentStore = inject(IncidentStore);
  protected readonly actionMessage = signal('');
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

  protected retryLoading(): void {
    this.actionMessage.set('Retrying incident request…');
    this.incidentStore.reload();
  }
}
