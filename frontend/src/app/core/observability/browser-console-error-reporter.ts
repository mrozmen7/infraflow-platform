import { Injectable } from '@angular/core';

import { ErrorReport, ErrorReporter } from './error-reporter';

@Injectable()
export class BrowserConsoleErrorReporter implements ErrorReporter {
  report(errorReport: ErrorReport): void {
    console.error('[InfraFlow unexpected error]', errorReport);
  }
}
