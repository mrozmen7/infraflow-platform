import { Component, input, output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { Incident } from '../../domain/incident';
import { IncidentCard } from '../incident-card/incident-card';

@Component({
  selector: 'app-incident-list',
  imports: [IncidentCard, TranslatePipe],
  templateUrl: './incident-list.html',
  styleUrl: './incident-list.scss',
})
export class IncidentList {
  readonly incidents = input.required<readonly Incident[]>();
  readonly selectedIncidentId = input<string | null>(null);
  readonly pendingAcknowledgementId = input<string | null>(null);

  readonly acknowledgeRequested = output<string>();
  readonly selectRequested = output<string>();
}
