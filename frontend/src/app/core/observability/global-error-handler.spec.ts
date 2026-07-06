import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { ErrorReport, ErrorReporter } from './error-reporter';
import { GlobalErrorHandler } from './global-error-handler';

class CapturingErrorReporter implements ErrorReporter {
  lastReport: ErrorReport | null = null;

  report(errorReport: ErrorReport): void {
    this.lastReport = errorReport;
  }
}

describe('GlobalErrorHandler', () => {
  it('reports normalized unexpected errors with route context', async () => {
    const reporter = new CapturingErrorReporter();
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        GlobalErrorHandler,
        { provide: ErrorReporter, useValue: reporter },
      ],
    });
    const router = TestBed.inject(Router);
    vi.spyOn(router, 'url', 'get').mockReturnValue('/incidents/new');

    TestBed.inject(GlobalErrorHandler).handleError(new TypeError('Form rendering failed'));

    expect(reporter.lastReport).toMatchObject({
      name: 'TypeError',
      message: 'Form rendering failed',
      route: '/incidents/new',
    });
    expect(reporter.lastReport?.occurredAt).toBeTruthy();
  });

  it('normalizes non-Error values without exposing application state', () => {
    const reporter = new CapturingErrorReporter();
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        GlobalErrorHandler,
        { provide: ErrorReporter, useValue: reporter },
      ],
    });

    TestBed.inject(GlobalErrorHandler).handleError({ sensitivePayload: 'not reported' });

    expect(reporter.lastReport?.message).toBe('Unknown unexpected error');
    expect(reporter.lastReport).not.toHaveProperty('sensitivePayload');
  });
});
