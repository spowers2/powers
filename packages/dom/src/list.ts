import {
  createRoot,
  effect,
  signal,
  type Dispose,
  type Signal,
} from "@power-ui/core";
import { remove } from "./insert.js";

export interface ListOptions<T> {
  /** Stable identity for reuse. Defaults to index (fine for append-only demos). */
  key?: (item: T, index: number) => string | number;
}

type Entry<T> = {
  key: string | number;
  node: Node;
  dispose: Dispose;
  index: Signal<number>;
  item: Signal<T>;
};

/**
 * Reactive list rendering with keyed reconciliation.
 *
 * **Note:** `parent` should be a dedicated container (e.g. a `ul` or `div`)
 * whose children are owned by this list.
 *
 * @example
 * ```ts
 * list(
 *   ul,
 *   () => todos(),
 *   (item, index) => h("li", { text: () => `${index()}: ${item().title}` }),
 *   { key: (t) => t.id },
 * );
 * ```
 */
export function list<T>(
  parent: ParentNode,
  getItems: () => readonly T[],
  render: (item: () => T, index: () => number) => Node,
  options?: ListOptions<T>,
): Dispose {
  const keyOf = options?.key;
  const entries = new Map<string | number, Entry<T>>();
  let order: Array<string | number> = [];

  const stop = effect(() => {
    const items = getItems();
    const nextKeys: Array<string | number> = [];
    const seen = new Set<string | number>();

    for (let i = 0; i < items.length; i++) {
      const value = items[i] as T;
      const key = keyOf ? keyOf(value, i) : i;
      nextKeys.push(key);
      seen.add(key);

      const existing = entries.get(key);
      if (!existing) {
        const index = signal(i);
        const item = signal(value);
        let node!: Node;
        let dispose!: Dispose;

        createRoot((d) => {
          dispose = d;
          node = render(
            () => item(),
            () => index(),
          );
        });

        entries.set(key, { key, node, dispose, index, item });
      } else {
        existing.index.set(i);
        existing.item.set(value);
      }
    }

    for (const key of order) {
      if (!seen.has(key)) {
        const entry = entries.get(key);
        if (entry) {
          entry.dispose();
          remove(entry.node);
          entries.delete(key);
        }
      }
    }

    // Move nodes into correct order (appendChild relocates existing nodes).
    for (const key of nextKeys) {
      const entry = entries.get(key);
      if (entry) parent.appendChild(entry.node);
    }

    order = nextKeys;
  });

  return () => {
    stop();
    for (const entry of entries.values()) {
      entry.dispose();
      remove(entry.node);
    }
    entries.clear();
    order = [];
  };
}
