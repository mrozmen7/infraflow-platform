import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { IncidentCard } from './features/incidents/ui/incident-card/incident-card';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, IncidentCard],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
