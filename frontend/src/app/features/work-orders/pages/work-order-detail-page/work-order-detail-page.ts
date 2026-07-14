import { DatePipe } from '@angular/common';
import { Component, inject, input, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { AuthSessionStore } from '../../../../core/auth/auth-session-store';
import { WorkOrderRepositoryPort } from '../../application';
import type { WorkOrder } from '../../domain/work-order';

@Component({ selector: 'app-work-order-detail-page', imports: [DatePipe, RouterLink], templateUrl: './work-order-detail-page.html', styleUrl: './work-order-detail-page.scss' })
export class WorkOrderDetailPage {
  private readonly repository = inject(WorkOrderRepositoryPort);
  private readonly router = inject(Router);
  private readonly auth = inject(AuthSessionStore);
  readonly workOrder = input.required<WorkOrder>();
  protected readonly processing = signal(false);
  protected readonly workflowError = signal('');
  protected readonly isAdmin = this.auth.hasRole('ADMIN');

  protected async move(action: 'ready' | 'start' | 'complete'): Promise<void> {
    this.processing.set(true);
    this.workflowError.set('');
    try {
      if (action === 'ready') await this.repository.moveToReady(this.workOrder().id);
      if (action === 'start') await this.repository.start(this.workOrder().id);
      if (action === 'complete') await this.repository.complete(this.workOrder().id);
      await this.router.navigate(['/work-orders']);
    } catch {
      this.workflowError.set('The workflow action was rejected. Reload the record and try again.');
    } finally { this.processing.set(false); }
  }
}
