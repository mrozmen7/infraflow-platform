import { TestBed } from '@angular/core/testing';
import type { Provider } from '@angular/core';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';

import de from '../../public/assets/i18n/de.json';
import en from '../../public/assets/i18n/en.json';

/**
 * Registers a root TranslateService without an HTTP loader, preloaded with the
 * real German and English translation catalogues. Specs activate English via
 * `useEnglishTranslations()` so they can keep asserting rendered English copy.
 */
export function provideTranslateTesting(): Provider[] {
  return provideTranslateService({ fallbackLang: 'en' });
}

export function useEnglishTranslations(): void {
  const translate = TestBed.inject(TranslateService);
  translate.setTranslation('de', de);
  translate.setTranslation('en', en);
  translate.use('en');
}
