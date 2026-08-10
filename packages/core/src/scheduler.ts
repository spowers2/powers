import type { ReactiveNode } from "./graph.js";

/** Effects queued during the current flush cycle. */
const queue: ReactiveNode[] = [];
let scheduled = false;
let flushing = false;
let batchDepth = 0;

function scheduleFlush(): void {
  // While flushing, newly enqueued work is drained by the active for-loop.
  if (scheduled || batchDepth > 0 || flushing) return;
  scheduled = true;
  queueMicrotask(flush);
}

/** Queue an effect node for execution. */
export function enqueue(node: ReactiveNode): void {
  if (node.pending) return;
  node.pending = true;
  queue.push(node);
  scheduleFlush();
}

/** Run all queued effects. Nested enqueues during flush are drained too. */
export function flush(): void {
  if (flushing) return;
  flushing = true;
  scheduled = false;

  try {
    // Index loop so effects enqueued during a run are drained in this pass.
    for (let i = 0; i < queue.length; i++) {
      const node = queue[i]!;
      node.pending = false;
      if (node.disposed || !node.run) continue;
      node.run();
    }
  } finally {
    queue.length = 0;
    flushing = false;
  }
}

/**
 * Batch multiple writes so dependents run once after the callback.
 * Nested batches collapse into the outermost boundary.
 */
export function batch<T>(fn: () => T): T {
  batchDepth++;
  try {
    return fn();
  } finally {
    batchDepth--;
    if (batchDepth === 0 && queue.length > 0) {
      flush();
    }
  }
}

/** True when currently inside `batch()`. */
export function isBatching(): boolean {
  return batchDepth > 0;
}
