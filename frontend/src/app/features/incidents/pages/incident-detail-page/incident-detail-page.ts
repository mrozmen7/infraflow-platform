import { DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Incident } from '../../domain/incident';

@Component({
  selector: 'app-incident-detail-page',
  imports: [DatePipe, RouterLink],
  templateUrl: './incident-detail-page.html',
  styleUrl: './incident-detail-page.scss',
})
export class IncidentDetailPage {
  readonly incident = input.required<Incident>();
}
