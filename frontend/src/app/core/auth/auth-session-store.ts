import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { APP_RUNTIME_CONFIG } from '../config/app-runtime-config';
import type { AuthCredentials, AuthSession } from './auth-session';
import { toAuthSession } from './auth-session';

@Injectable({ providedIn: 'root' })
export class AuthSessionStore {
  private readonly http = inject(HttpClient);
  private readonly runtimeConfig = inject(APP_RUNTIME_CONFIG);
  private readonly sessionSource = signal<AuthSession | null>(null);

  readonly session = this.sessionSource.asReadonly();
  readonly isAuthenticated = computed(
    () => this.runtimeConfig.authentication.mode === 'disabled' || this.session() !== null,
  );
  readonly roles = computed(() => this.session()?.roles ?? []);

  async login(credentials: AuthCredentials): Promise<void> {
    if (this.runtimeConfig.authentication.mode === 'disabled') {
      return;
    }

    const session = await firstValueFrom(
      this.http.post<unknown>(`${this.runtimeConfig.apiBaseUrl}/v1/auth/login`, credentials),
    );

    this.sessionSource.set(toAuthSession(session));
  }

  logout(): void {
    this.sessionSource.set(null);
  }

  hasRole(role: string): boolean {
    return this.roles().includes(role);
  }
}
