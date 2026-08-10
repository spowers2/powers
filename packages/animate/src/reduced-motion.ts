let override: boolean | null = null;

/**
 * Detect `prefers-reduced-motion: reduce`.
 * Safe on server (returns false unless overridden).
 */
export function prefersReducedMotion(): boolean {
  if (override !== null) return override;
  if (typeof matchMedia !== "function") return false;
  try {
    return matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return false;
  }
}

/**
 * Force reduced-motion on/off (tests, user settings).
 * Pass `null` to clear the override.
 */
export function setReducedMotionOverride(value: boolean | null): void {
  override = value;
}
