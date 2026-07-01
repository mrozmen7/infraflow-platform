import { Component } from '@angular/core';

type IncidentSeverity = 'Low' | 'Medium' | 'High' | 'Critical';

@Component({
  selector: 'app-incident-card',
  templateUrl: './incident-card.html',
  styleUrl: './incident-card.scss',
})
export class IncidentCard {
  protected readonly incidentId = 'INC-2026-0001';
  protected readonly title = 'Transformer smoke detected';
  protected readonly location = 'North Tunnel · KM 3.0';
  protected readonly reportedAt = '30 June 2026 · 17:42';
  protected readonly severity: IncidentSeverity = 'Critical';
  protected readonly operationalSignals = [
    'Smoke detected',
    'Lighting unavailable',
    'Traffic active',
  ];
  protected acknowledged = false;

  protected acknowledge(): void {
    this.acknowledged = true;
  }
}
