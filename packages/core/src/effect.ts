import {
  clearSources,
  createNode,
  disposeNode,
  getActiveOwner,
  setActiveNode,
  type ReactiveNode,
} from "./graph.js";
import { reportError } from "./errors.js";
import { enqueue } from "./scheduler.js";
import type { Dispose, EffectFn } from "./types.js";

export interface EffectOptions {
  name?: string;
  /** Local error handler (runs before owner `onError` handlers). */
  onError?: (error: unknown) => void;
}

/**
 * Run `fn` immediately, track reactive reads, and re-run when they change.
 * Returns a dispose function. `fn` may return a cleanup called before the
 * next run and on dispose.
 *
 * Errors are caught so one bad effect cannot tear down the whole graph.
 * Handle them with `options.onError` or owner-level `onError()`.
 *
 * @example
 * ```ts
 * const stop = effect(() => {
 *   console.log(count());
 *   return () => console.log("cleanup");
 * });
 * stop();
 * ```
 */
export function effect(fn: EffectFn, options?: EffectOptions): Dispose {
  const node = createNode("effect", options?.name);
  const owner = getActiveOwner();
  const localOnError = options?.onError;

  const run = () => {
    if (node.disposed) return;

    if (node.cleanup) {
      const c = node.cleanup;
      node.cleanup = undefined;
      try {
        c();
      } catch (err) {
        handle(err);
      }
    }

    clearSources(node);

    const prev = setActiveNode(node);
    try {
      const cleanup = fn();
      if (typeof cleanup === "function") {
        node.cleanup = cleanup;
      }
    } catch (err) {
      handle(err);
    } finally {
      setActiveNode(prev);
    }
  };

  function handle(err: unknown): void {
    if (localOnError) {
      try {
        localOnError(err);
        return;
      } catch (handlerError) {
        // Fall through to owner handlers with the handler error.
        if (reportError(handlerError, owner)) return;
        console.error("[powers] effect onError handler threw:", handlerError);
        return;
      }
    }
    if (reportError(err, owner)) return;
    console.error("[powers] Unhandled effect error:", err);
  }

  node.run = run;

  // Initial run is synchronous so first paint / first log is immediate.
  run();

  return () => {
    disposeNode(node);
  };
}

/**
 * Schedule an effect run without running it now.
 * Primarily for internal/testing use.
 */
export function scheduleEffect(node: ReactiveNode): void {
  enqueue(node);
}
