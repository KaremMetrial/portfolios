/** "field_service" → "field service" (CSS capitalizes where needed). */
export function formatDomain(domain: string): string {
  return domain.replace(/[_-]+/g, " ");
}
