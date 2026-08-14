/**
 * Shared prop reading for form / control primitives.
 *
 * Prefer `mergeProps` / `createProps` so accessors and signals unwrap on
 * property access. These helpers still work on *raw* values when needed
 * (e.g. reading before merge, or defensive double-unwrap).
 *
 * Call inside an `effect` (or JSX reactive binding) so dependencies track.
 */

/** Plain value or zero-arg accessor / signal-like function. */
export type MaybeReactive<T> = T | (() => T);

/**
 * Resolve `T | (() => T)`.
 * - functions with arity 0 (including signals) are called
 * - multi-arg functions are returned as-is (not used as accessors)
 * - everything else is returned as-is
 */
export function readProp<T>(value: MaybeReactive<T> | null | undefined): T | undefined {
  if (value == null) return undefined;
  if (typeof value === "function") {
    // Signals and zero-arg accessors only
    if ((value as (...args: unknown[]) => unknown).length === 0) {
      return (value as () => T)();
    }
  }
  return value as T;
}

/** Boolean controls (`disabled`, `checked`, …). */
export function readBool(
  value: MaybeReactive<boolean> | null | undefined,
): boolean {
  return !!readProp(value);
}

/** String controls (`value`, `placeholder`, …). Nullish → `""`. */
export function readStr(
  value: MaybeReactive<string> | null | undefined,
): string {
  const v = readProp(value);
  return v == null ? "" : String(v);
}

/** Numeric controls. Nullish → `fallback`. */
export function readNum(
  value: MaybeReactive<number> | null | undefined,
  fallback = 0,
): number {
  const v = readProp(value);
  if (v == null || Number.isNaN(Number(v))) return fallback;
  return Number(v);
}
