import {
  clearSources,
  createNode,
  disposeNode,
  setActiveNode,
  type ReactiveNode,
} from "./graph.js";
import { enqueue } from "./scheduler.js";
import type { Dispose, EffectFn } from "./types.js";

/**
 * Run `fn` immediately, track reactive reads, and re-run when they change.
 * Returns a dispose function. `fn` may return a cleanup called before the
 * next run and on dispose.
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
export function effect(fn: EffectFn, options?: { name?: string }): Dispose {
  const node = createNode("effect", options?.name);

  const run = () => {
    if (node.disposed) return;

    if (node.cleanup) {
      const c = node.cleanup;
      node.cleanup = undefined;
      c();
    }

    clearSources(node);

    const prev = setActiveNode(node);
    try {
      const cleanup = fn();
      if (typeof cleanup === "function") {
        node.cleanup = cleanup;
      }
    } finally {
      setActiveNode(prev);
    }
  };

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
