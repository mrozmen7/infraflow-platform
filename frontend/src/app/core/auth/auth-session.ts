export type AuthCredentials = {
  readonly username: string;
  readonly password: string;
};

export type AuthSession = {
  readonly accessToken: string;
  readonly roles: readonly string[];
  readonly tokenType: 'Bearer';
};

type TokenResponse = {
  readonly tokenType: unknown;
  readonly accessToken: unknown;
  readonly refreshToken: unknown;
  readonly roles: unknown;
};

export function toAuthSession(value: unknown): AuthSession {
  if (!isTokenResponse(value)) {
    throw new Error('The authentication service returned an invalid token response.');
  }

  if (value.tokenType !== 'Bearer' || typeof value.accessToken !== 'string') {
    throw new Error('The authentication service returned an unsupported access token.');
  }

  if (!Array.isArray(value.roles) || !value.roles.every((role) => typeof role === 'string')) {
    throw new Error('The authentication service returned invalid roles.');
  }

  return Object.freeze({
    accessToken: value.accessToken,
    roles: Object.freeze([...value.roles]),
    tokenType: 'Bearer',
  });
}

function isTokenResponse(value: unknown): value is TokenResponse {
  return typeof value === 'object' && value !== null;
}
