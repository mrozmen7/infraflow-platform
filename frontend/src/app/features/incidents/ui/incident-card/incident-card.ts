import { DatePipe } from '@angular/common';
import { Component, computed, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';

import { canAcknowledgeIncident, Incident } from '../../domain/incident';

@Component({
  selector: 'app-incident-card',
  imports: [DatePipe, RouterLink],
  templateUrl: './incident-card.html',
  styleUrl: './incident-card.scss',
})
export class IncidentCard {
  readonly incident = input.required<Incident>();
  readonly selected = input(false);

  readonly acknowledgeRequested = output<string>();
  readonly selectRequested = output<string>();

  protected readonly canAcknowledge = computed(() => canAcknowledgeIncident(this.incident()));

  protected readonly guidance = computed(() => {
    switch (this.incident().severity) {
      case 'Critical':
        return 'Immediate safety response required';
      case 'High':
        return 'Urgent operational review required';
      case 'Medium':
        return 'Plan an operational inspection';
      case 'Low':
        return 'Monitor during standard operations';
    }
  });
}
