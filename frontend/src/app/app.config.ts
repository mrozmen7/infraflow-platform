import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { provideErrorObservability } from './core/observability/provide-error-observability';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    ...provideErrorObservability(),
    provideHttpClient(),
    provideRouter(routes, withComponentInputBinding()),
  ],
};
