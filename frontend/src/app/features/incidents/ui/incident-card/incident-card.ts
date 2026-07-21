import { DatePipe } from '@angular/common';
import { Component, computed, inject, input, output } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { canAcknowledgeIncident, Incident } from '../../domain/incident';

@Component({
  selector: 'app-incident-card',
  imports: [DatePipe, RouterLink, TranslatePipe],
  templateUrl: './incident-card.html',
  styleUrl: './incident-card.scss',
})
export class IncidentCard {
  private readonly translate = inject(TranslateService);
  private readonly activeLanguage = toSignal(this.translate.onLangChange, { initialValue: null });

  readonly incident = input.required<Incident>();
  readonly selected = input(false);
  readonly acknowledgementPending = input(false);

  readonly acknowledgeRequested = output<string>();
  readonly selectRequested = output<string>();

  protected readonly canAcknowledge = computed(() => canAcknowledgeIncident(this.incident()));

  protected readonly guidance = computed(() => {
    this.activeLanguage();

    return this.translate.instant(
      `incidents.card.guidance.${this.incident().severity.toLowerCase()}`,
    );
  });
}
