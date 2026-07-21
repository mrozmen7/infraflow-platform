import { DatePipe } from '@angular/common';
import { Component, computed, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import {
  canAcknowledgeIncident,
  canStartIncidentResponse,
  Incident,
} from '../../domain/incident';

@Component({
  selector: 'app-incident-inspector',
  imports: [DatePipe, RouterLink, TranslatePipe],
  templateUrl: './incident-inspector.html',
  styleUrl: './incident-inspector.scss',
})
export class IncidentInspector {
  readonly incident = input.required<Incident>();
  readonly acknowledgementPending = input(false);
  readonly responseStartPending = input(false);
  readonly acknowledgeRequested = output<string>();
  readonly responseStartRequested = output<string>();

  protected readonly canAcknowledge = computed(() => canAcknowledgeIncident(this.incident()));
  protected readonly canStartResponse = computed(() =>
    canStartIncidentResponse(this.incident()),
  );
}
