import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { AuthSessionStore } from '../../../core/auth/auth-session-store';

@Component({
  selector: 'app-login-page',
  imports: [TranslatePipe],
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss',
})
export class LoginPage {
  private readonly authSession = inject(AuthSessionStore);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly translate = inject(TranslateService);

  protected readonly username = signal('');
  protected readonly password = signal('');
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly isSubmitting = signal(false);
  protected readonly canSubmit = computed(
    () => this.username().trim().length > 0 && this.password().length > 0,
  );

  protected async submit(): Promise<void> {
    this.errorMessage.set(null);
    this.isSubmitting.set(true);

    try {
      await this.authSession.login({
        username: this.username().trim(),
        password: this.password(),
      });
      const returnUrl = this.activatedRoute.snapshot.queryParamMap.get('returnUrl');
      await this.router.navigateByUrl(isSafeReturnUrl(returnUrl) ? returnUrl : '/incidents');
    } catch (error: unknown) {
      this.errorMessage.set(this.toLoginErrorMessage(error));
    } finally {
      this.isSubmitting.set(false);
    }
  }

  private toLoginErrorMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse && error.status === 401) {
      return this.translate.instant('login.invalidCredentials');
    }

    return this.translate.instant('login.serviceUnavailable');
  }
}

function isSafeReturnUrl(value: string | null): value is string {
  return typeof value === 'string' && value.startsWith('/') && !value.startsWith('//');
}
