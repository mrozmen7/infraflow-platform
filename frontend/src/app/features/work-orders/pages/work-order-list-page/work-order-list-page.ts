import { DatePipe } from '@angular/common';
import { Component, inject, resource, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { WorkOrderRepositoryPort } from '../../application';

@Component({
  selector: 'app-work-order-list-page',
  imports: [DatePipe, RouterLink],
  templateUrl: './work-order-list-page.html',
  styleUrl: './work-order-list-page.scss',
})
export class WorkOrderListPage {
  private readonly repository = inject(WorkOrderRepositoryPort);
  private readonly route = inject(ActivatedRoute);
  protected readonly draftIncidentId = signal(this.route.snapshot.queryParamMap.get('incidentId') ?? '');
  protected readonly draftMessage = signal('');
  protected readonly draftError = signal('');
  protected readonly drafting = signal(false);
  protected readonly workOrders = resource({ loader: () => this.repository.findAll() });

  protected updateDraftIncident(event: Event): void {
    this.draftIncidentId.set((event.target as HTMLInputElement).value);
  }

  protected async createDraft(): Promise<void> {
    const incidentId = this.draftIncidentId().trim();
    if (!incidentId) {
      this.draftError.set('Choose an Incident ID before creating a draft.');
      return;
    }

    this.drafting.set(true);
    this.draftMessage.set('');
    this.draftError.set('');
    try {
      const workOrder = await this.repository.draftFromIncident(incidentId);
      this.draftMessage.set(`${workOrder.id} was created as a controlled draft.`);
      this.workOrders.reload();
    } catch {
      this.draftError.set('The draft could not be created. Check the Incident ID and your access.');
    } finally {
      this.drafting.set(false);
    }
  }
}
