import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { authTokenInterceptor } from './core/auth/auth-token.interceptor';
import { AuthSessionStore } from './core/auth/auth-session-store';
import { APP_RUNTIME_CONFIG, HTTP_APP_RUNTIME_CONFIG } from './core/config/app-runtime-config';
import { provideAppTranslate } from './core/i18n/provide-app-translate';
import { provideErrorObservability } from './core/observability/provide-error-observability';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    ...provideErrorObservability(),
    { provide: APP_RUNTIME_CONFIG, useValue: HTTP_APP_RUNTIME_CONFIG },
    provideHttpClient(withInterceptors([authTokenInterceptor])),
    ...provideAppTranslate(),
    provideAppInitializer(() => inject(AuthSessionStore).restore()),
    provideRouter(routes, withComponentInputBinding()),
  ],
};
