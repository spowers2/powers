import { getActiveOwner, type Owner } from "./graph.js";
import type { Dispose } from "./types.js";

type ErrorHandler = (error: unknown) => void;

/** Owner → handlers registered while that owner is active. */
const ownerHandlers = new WeakMap<Owner, Set<ErrorHandler>>();

/** Fallback when no owner handler claims the error. */
let globalHandler: ErrorHandler | null = null;

/**
 * Register an error handler for the **current owner** (from `createRoot`).
 * Effect errors bubble to these handlers instead of crashing the graph.
 *
 * @example
 * ```ts
 * createRoot(() => {
 *   onError((err) => console.error("caught", err));
 *   effect(() => { throw new Error("boom"); });
 * });
 * ```
 */
export function onError(fn: ErrorHandler): Dispose {
  const owner = getActiveOwner();
  if (!owner) {
    // No owner — install as process-local global for this call site's lifetime.
    const prev = globalHandler;
    globalHandler = fn;
    return () => {
      if (globalHandler === fn) globalHandler = prev;
    };
  }

  let set = ownerHandlers.get(owner);
  if (!set) {
    set = new Set();
    ownerHandlers.set(owner, set);
  }
  set.add(fn);

  return () => {
    set!.delete(fn);
  };
}

/**
 * Report an error to the nearest owner handlers, then parent owners,
 * then the global handler. Returns true if anyone handled it.
 */
export function reportError(error: unknown, owner: Owner | null): boolean {
  let current: Owner | null = owner;
  while (current) {
    const set = ownerHandlers.get(current);
    if (set && set.size > 0) {
      for (const handler of set) {
        try {
          handler(error);
        } catch (handlerError) {
          // Handler bugs should not recurse forever.
          console.error("[power-ui] onError handler threw:", handlerError);
        }
      }
      return true;
    }
    current = current.parent;
  }

  if (globalHandler) {
    try {
      globalHandler(error);
    } catch (handlerError) {
      console.error("[power-ui] onError handler threw:", handlerError);
    }
    return true;
  }

  return false;
}

/** @internal */
export function clearGlobalErrorHandler(): void {
  globalHandler = null;
}
