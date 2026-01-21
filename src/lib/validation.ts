export const VALIDATION_LIMITS = {
  LOCATION_NAME_MAX_LENGTH: 50,
  LABEL_MAX_LENGTH: 100,
} as const;

export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, "")
    .slice(0, VALIDATION_LIMITS.LABEL_MAX_LENGTH);
}

export function sanitizeLocationName(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, "")
    .slice(0, VALIDATION_LIMITS.LOCATION_NAME_MAX_LENGTH);
}

export function isValidLocationName(name: string): boolean {
  const trimmed = name.trim();
  return trimmed.length > 0 && trimmed.length <= VALIDATION_LIMITS.LOCATION_NAME_MAX_LENGTH;
}

export function isValidLabel(label: string): boolean {
  const trimmed = label.trim();
  return trimmed.length > 0 && trimmed.length <= VALIDATION_LIMITS.LABEL_MAX_LENGTH;
}
