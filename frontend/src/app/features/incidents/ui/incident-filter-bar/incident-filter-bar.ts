import { Component, ElementRef, input, output, viewChild } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { IncidentSeverityFilter, incidentSeverities } from '../../domain/incident';

@Component({
  selector: 'app-incident-filter-bar',
  imports: [TranslatePipe],
  templateUrl: './incident-filter-bar.html',
  styleUrl: './incident-filter-bar.scss',
})
export class IncidentFilterBar {
  readonly searchTerm = input.required<string>();
  readonly severity = input.required<IncidentSeverityFilter>();

  readonly searchTermChanged = output<string>();
  readonly severityChanged = output<IncidentSeverityFilter>();
  readonly resetRequested = output<void>();

  protected readonly severityOptions: readonly IncidentSeverityFilter[] = [
    'All',
    ...incidentSeverities,
  ];

  private readonly searchInput = viewChild.required<ElementRef<HTMLInputElement>>('searchInput');

  focusSearch(): void {
    this.searchInput().nativeElement.focus();
  }

  protected onSearchInput(event: Event): void {
    this.searchTermChanged.emit((event.target as HTMLInputElement).value);
  }

  protected onSeverityChange(event: Event): void {
    this.severityChanged.emit((event.target as HTMLSelectElement).value as IncidentSeverityFilter);
  }
}
