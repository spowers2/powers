import { createNode, notify, setActiveNode, track } from "./graph.js";
import type { ReadonlySignal, Signal, SignalOptions } from "./types.js";

const defaultEquals = Object.is;

/**
 * Create a writable fine-grained reactive value.
 *
 * @example
 * ```ts
 * const count = signal(0);
 * count();           // 0 (tracked read)
 * count.set(1);
 * count.update(n => n + 1);
 * count.peek();      // untracked read
 * ```
 */
export function signal<T>(
  initial: T,
  options?: SignalOptions<T>,
): Signal<T> {
  const equals = options?.equals ?? defaultEquals;
  const node = createNode("signal", options?.name);
  let value = initial;

  const read = (() => {
    track(node);
    return value;
  }) as Signal<T>;

  read.peek = () => value;

  read.set = (next: T) => {
    if (equals(value, next)) return;
    value = next;
    notify(node);
  };

  read.update = (fn: (prev: T) => T) => {
    read.set(fn(value));
  };

  if (options?.name !== undefined) {
    Object.defineProperty(read, "name", { value: options.name });
  }

  return read;
}

/**
 * Create a derived readonly value that recomputes only when dependencies change.
 *
 * @example
 * ```ts
 * const double = computed(() => count() * 2);
 * double(); // tracked
 * ```
 */
export function computed<T>(
  fn: () => T,
  options?: SignalOptions<T>,
): ReadonlySignal<T> {
  const equals = options?.equals ?? defaultEquals;
  const node = createNode("computed", options?.name);
  let value!: T;
  let hasValue = false;

  const recompute = (): void => {
    // Drop previous source links before re-tracking.
    for (const source of node.sources) {
      source.observers.delete(node);
    }
    node.sources.clear();

    const prev = setActiveNode(node);
    try {
      const next = fn();
      const changed = !hasValue || !equals(value, next);
      value = next;
      hasValue = true;
      node.dirty = false;

      // If value is unchanged after a dirty cycle, suppress further
      // effect churn by not re-notifying. Effects already enqueued will
      // still run once and see the same value — acceptable for v0.1.
      void changed;
    } finally {
      setActiveNode(prev);
    }
  };

  node.run = recompute;

  const ensure = (): T => {
    if (node.disposed) return value;
    if (node.dirty || !hasValue) {
      recompute();
    }
    return value;
  };

  const read = (() => {
    const v = ensure();
    track(node);
    return v;
  }) as ReadonlySignal<T>;

  read.peek = () => ensure();

  if (options?.name !== undefined) {
    Object.defineProperty(read, "name", { value: options.name });
  }

  return read;
}
