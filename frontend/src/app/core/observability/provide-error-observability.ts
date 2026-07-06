import { ErrorHandler, type Provider } from '@angular/core';

import { BrowserConsoleErrorReporter } from './browser-console-error-reporter';
import { ErrorReporter } from './error-reporter';
import { GlobalErrorHandler } from './global-error-handler';

export function provideErrorObservability(): readonly Provider[] {
  return [
    { provide: ErrorReporter, useClass: BrowserConsoleErrorReporter },
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
  ];
}
