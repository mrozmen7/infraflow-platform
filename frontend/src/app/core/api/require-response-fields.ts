/**
 * Generated OpenAPI response models declare every field optional because the
 * contract cannot mark server-populated properties as guaranteed. The backend
 * always sends complete payloads, so repositories assert presence at the
 * boundary and fail loudly instead of propagating `undefined` into the domain.
 */
export function requireResponseFields<T extends object>(
  value: T,
  fields: readonly (keyof T)[],
  context: string,
): void {
  for (const field of fields) {
    if (value[field] === undefined || value[field] === null) {
      throw new Error(`${context} is missing required field "${String(field)}".`);
    }
  }
}
