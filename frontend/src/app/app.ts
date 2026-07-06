import { Component, computed, ElementRef, inject, viewChild } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './app.html',
  styleUrls: ['./app.scss', './app-navigation.scss'],
})
export class App {
  private readonly router = inject(Router);
  private readonly mainContent = viewChild.required<ElementRef<HTMLElement>>('mainContent');

  protected readonly isNavigating = computed(() => this.router.currentNavigation() !== null);

  protected focusMainContent(): void {
    queueMicrotask(() => this.mainContent().nativeElement.focus());
  }
}
