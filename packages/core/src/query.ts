import { resource } from "./resource.js";
import type { Resource, ResourceOptions } from "./resource.js";

export type QueryKey = string | number | false | null | undefined;

export type CreateQueryOptions<T> = {
  /**
   * Reactive key. When `false` / `null` / `undefined`, the query is idle
   * (no fetch). Change the key to re-run — same mental model as signals.
   */
  queryKey: () => QueryKey;
  /** Async work for the current key. */
  queryFn: (key: string) => Promise<T> | T;
  /** Seed UI before the first success. */
  initialData?: T;
  /** Debug name for the underlying resource. */
  name?: string;
};

/**
 * Signal-native async query — thin, intentional ergonomics on `resource`.
 *
 * Why it feels great with Powers:
 * - The key is a **function of signals** — no dependency arrays
 * - `data()` / `loading()` / `error()` are fine-grained
 * - `refetch()` re-runs without remounting the page
 *
 * @example
 * ```ts
 * const q = signal("design");
 * const art = createQuery({
 *   queryKey: () => q(),
 *   queryFn: (key) => fetch(`/api/search?q=${key}`).then((r) => r.json()),
 * });
 * // art() · art.loading() · art.error() · art.refetch()
 * ```
 */
export function createQuery<T>(
  options: CreateQueryOptions<T>,
): Resource<T> {
  const opts: ResourceOptions<T> = {
    name: options.name ?? "query",
  };
  if (options.initialData !== undefined) {
    opts.initialValue = options.initialData;
  }

  return resource(
    () => {
      const k = options.queryKey();
      if (k === false || k === null || k === undefined) return false as const;
      return String(k);
    },
    (key) => options.queryFn(key),
    opts,
  );
}
