export interface ErrorReport {
  readonly name: string;
  readonly message: string;
  readonly stack: string | null;
  readonly route: string;
  readonly occurredAt: string;
}

export abstract class ErrorReporter {
  abstract report(errorReport: ErrorReport): void;
}
