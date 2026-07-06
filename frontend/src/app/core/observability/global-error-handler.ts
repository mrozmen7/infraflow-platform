import { ErrorHandler, inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { ErrorReporter } from './error-reporter';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private readonly errorReporter = inject(ErrorReporter);
  private readonly router = inject(Router);

  handleError(error: unknown): void {
    const normalizedError = normalizeError(error);

    this.errorReporter.report({
      name: normalizedError.name,
      message: normalizedError.message,
      stack: normalizedError.stack ?? null,
      route: this.router.url,
      occurredAt: new Date().toISOString(),
    });
  }
}

function normalizeError(error: unknown): Error {
  if (error instanceof Error) {
    return error;
  }

  if (typeof error === 'string') {
    return new Error(error);
  }

  return new Error('Unknown unexpected error');
}
