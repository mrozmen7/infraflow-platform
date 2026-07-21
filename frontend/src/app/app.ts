import { Component, computed, ElementRef, inject, signal, viewChild } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import {
  APP_LANGUAGES,
  AppLanguage,
  persistLanguage,
  resolveInitialLanguage,
} from './core/i18n/app-language';

@Component({
  selector: 'app-root',
  imports: [RouterLink, RouterLinkActive, RouterOutlet, TranslatePipe],
  templateUrl: './app.html',
  styleUrls: ['./app.scss', './app-navigation.scss'],
})
export class App {
  private readonly router = inject(Router);
  private readonly translate = inject(TranslateService);
  private readonly mainContent = viewChild.required<ElementRef<HTMLElement>>('mainContent');

  protected readonly isNavigating = computed(() => this.router.currentNavigation() !== null);

  protected readonly supportedLanguages = APP_LANGUAGES;
  protected readonly activeLanguage = signal<AppLanguage>(resolveInitialLanguage());

  constructor() {
    this.translate.use(this.activeLanguage());
  }

  protected selectLanguage(language: AppLanguage): void {
    if (language === this.activeLanguage()) {
      return;
    }

    this.activeLanguage.set(language);
    persistLanguage(language);
    this.translate.use(language);
  }

  protected focusMainContent(): void {
    queueMicrotask(() => this.mainContent().nativeElement.focus());
  }
}
