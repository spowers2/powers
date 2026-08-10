import { untrack } from "./graph.js";
import { batch } from "./scheduler.js";
import { computed, signal } from "./signal.js";
import { effect } from "./effect.js";
import type { ReadonlySignal, SignalOptions } from "./types.js";

/** Lifecycle of a resource fetch. */
export type ResourceState = "pending" | "ready" | "errored";

export interface ResourceFetcherInfo<T> {
  /** Previous successful value, if any. */
  value: T | undefined;
  /** True when we already had data and are fetching again. */
  refetching: boolean;
}

export type ResourceFetcher<T, S> = (
  source: S,
  info: ResourceFetcherInfo<T>,
) => T | Promise<T>;

export interface ResourceOptions<T> extends SignalOptions<T | undefined> {
  /** Initial value before the first fetch settles. */
  initialValue?: T;
}

/**
 * Async-friendly reactive value.
 *
 * Learn it in 30 seconds:
 * - `user()` → data (or `undefined` while loading the first time)
 * - `user.loading()` → is a fetch in flight?
 * - `user.error()` → last error, if any
 * - `user.refetch()` → run again
 *
 * @example Fetcher only
 * ```ts
 * const users = resource(async () => {
 *   const res = await fetch("/api/users");
 *   return res.json() as Promise<User[]>;
 * });
 * ```
 *
 * @example Reactive source + fetcher (re-runs when source changes)
 * ```ts
 * const id = signal(1);
 * const user = resource(
 *   () => id(),
 *   async (id) => (await fetch(`/api/users/${id}`)).json(),
 * );
 * ```
 */
export interface Resource<T> extends ReadonlySignal<T | undefined> {
  /** True while a fetch is in flight. */
  readonly loading: ReadonlySignal<boolean>;
  /** Last error from the fetcher (cleared on success). */
  readonly error: ReadonlySignal<unknown>;
  /** Last successful value — kept during refetch so UI can stay stable. */
  readonly latest: ReadonlySignal<T | undefined>;
  /** Coarse lifecycle state. */
  readonly state: ReadonlySignal<ResourceState>;
  /** Re-run the fetcher with the current source. */
  refetch(): void;
}

export function resource<T>(
  fetcher: (
    source: true,
    info: ResourceFetcherInfo<T>,
  ) => T | Promise<T>,
  options?: ResourceOptions<T>,
): Resource<T>;

export function resource<T, S>(
  source: () => S,
  fetcher: ResourceFetcher<T, S>,
  options?: ResourceOptions<T>,
): Resource<T>;

export function resource<T, S>(
  sourceOrFetcher:
    | (() => S)
    | ((source: true, info: ResourceFetcherInfo<T>) => T | Promise<T>),
  fetcherOrOptions?: ResourceFetcher<T, S> | ResourceOptions<T>,
  maybeOptions?: ResourceOptions<T>,
): Resource<T> {
  const hasSource = typeof fetcherOrOptions === "function";
  const source = (
    hasSource ? sourceOrFetcher : () => true as unknown as S
  ) as () => S;
  const fetcher = (
    hasSource
      ? fetcherOrOptions
      : (sourceOrFetcher as (
          source: S,
          info: ResourceFetcherInfo<T>,
        ) => T | Promise<T>)
  ) as ResourceFetcher<T, S>;
  const options = (
    hasSource ? maybeOptions : (fetcherOrOptions as ResourceOptions<T> | undefined)
  ) as ResourceOptions<T> | undefined;

  const initial = options?.initialValue;
  const data = signal<T | undefined>(initial, {
    name: options?.name ? `${options.name}:data` : "resource:data",
    ...(options?.equals ? { equals: options.equals } : {}),
  });
  const loading = signal(true, { name: "resource:loading" });
  const error = signal<unknown>(undefined, { name: "resource:error" });
  const latest = signal<T | undefined>(initial, { name: "resource:latest" });
  const tick = signal(0, { name: "resource:tick" });

  const state = computed<ResourceState>(
    () => {
      if (error() !== undefined) return "errored";
      if (loading()) return "pending";
      return "ready";
    },
    { name: "resource:state" },
  );

  let currentToken = 0;
  let disposed = false;
  let hasSucceeded = initial !== undefined;

  const runFetch = () => {
    if (disposed) return;

    const token = ++currentToken;
    const sourceValue = untrack(() => source());

    // Skip until the source is ready (null | undefined | false).
    if (sourceValue === false || sourceValue === null || sourceValue === undefined) {
      batch(() => {
        loading.set(false);
      });
      return;
    }

    const refetching = hasSucceeded;

    batch(() => {
      loading.set(true);
      error.set(undefined);
    });

    let result: T | Promise<T>;
    try {
      result = fetcher(sourceValue, {
        value: latest.peek(),
        refetching,
      });
    } catch (err) {
      if (token !== currentToken || disposed) return;
      batch(() => {
        error.set(err);
        loading.set(false);
      });
      return;
    }

    const settle = (ok: boolean, value: T | unknown) => {
      if (token !== currentToken || disposed) return;
      batch(() => {
        if (ok) {
          data.set(value as T);
          latest.set(value as T);
          error.set(undefined);
          hasSucceeded = true;
        } else {
          error.set(value);
        }
        loading.set(false);
      });
    };

    if (isThenable(result)) {
      result.then(
        (value) => settle(true, value),
        (err) => settle(false, err),
      );
    } else {
      settle(true, result);
    }
  };

  effect(
    () => {
      source();
      tick();
      runFetch();
      return () => {
        // Invalidate in-flight work when deps change or the effect disposes.
        currentToken++;
      };
    },
    { name: options?.name ? `${options.name}:effect` : "resource:effect" },
  );

  // When the owner disposes all effects, in-flight promises must no-op.
  // The cleanup above bumps the token on each re-run; final dispose also runs it.
  // Additionally guard with a disposed flag via a zero-dep lifetime effect:
  effect(
    () => {
      return () => {
        disposed = true;
        currentToken++;
      };
    },
    { name: "resource:lifetime" },
  );

  const read = Object.assign((() => data()) as ReadonlySignal<T | undefined>, {
    peek: () => data.peek(),
    loading,
    error,
    latest,
    state,
    refetch: () => {
      if (disposed) return;
      tick.update((v) => v + 1);
    },
  }) as Resource<T>;

  if (options?.name !== undefined) {
    Object.defineProperty(read, "name", { value: options.name });
  }

  return read;
}

function isThenable<T>(value: T | Promise<T>): value is Promise<T> {
  return (
    typeof value === "object" &&
    value !== null &&
    "then" in value &&
    typeof (value as Promise<T>).then === "function"
  );
}
