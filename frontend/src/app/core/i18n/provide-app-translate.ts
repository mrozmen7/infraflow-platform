import type { Provider } from '@angular/core';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';

/**
 * Application-wide translation setup. Translation files are served from
 * `assets/i18n/<lang>.json`; the relative prefix keeps the GitHub Pages demo
 * (base href `/infraflow-platform/`) working. English is the fallback language,
 * German the product default (see `app-language.ts`).
 */
export function provideAppTranslate(): Provider[] {
  return provideTranslateService({
    fallbackLang: 'en',
    loader: provideTranslateHttpLoader({
      prefix: './assets/i18n/',
      suffix: '.json',
    }),
  });
}
