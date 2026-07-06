import { DatePipe } from '@angular/common';
import { Component, computed, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';

import { canAcknowledgeIncident, Incident } from '../../domain/incident';

@Component({
  selector: 'app-incident-inspector',
  imports: [DatePipe, RouterLink],
  templateUrl: './incident-inspector.html',
  styleUrl: './incident-inspector.scss',
})
export class IncidentInspector {
  readonly incident = input.required<Incident>();
  readonly acknowledgementPending = input(false);
  readonly acknowledgeRequested = output<string>();

  protected readonly canAcknowledge = computed(() => canAcknowledgeIncident(this.incident()));
}
