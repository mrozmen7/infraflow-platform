export const APP_LANGUAGES = ['de', 'en'] as const;

export type AppLanguage = (typeof APP_LANGUAGES)[number];

export const DEFAULT_LANGUAGE: AppLanguage = 'de';

export const LANGUAGE_STORAGE_KEY = 'infraflow-language';

export function isAppLanguage(value: string | null): value is AppLanguage {
  return value !== null && (APP_LANGUAGES as readonly string[]).includes(value);
}

export function resolveInitialLanguage(): AppLanguage {
  try {
    const stored = globalThis.localStorage?.getItem(LANGUAGE_STORAGE_KEY) ?? null;

    if (isAppLanguage(stored)) {
      return stored;
    }
  } catch {
    // Storage can be unavailable (for example in hardened browsers); fall back to the default.
  }

  return DEFAULT_LANGUAGE;
}

export function persistLanguage(language: AppLanguage): void {
  try {
    globalThis.localStorage?.setItem(LANGUAGE_STORAGE_KEY, language);
  } catch {
    // Persistence is best-effort; the in-memory selection still applies for the session.
  }
}
