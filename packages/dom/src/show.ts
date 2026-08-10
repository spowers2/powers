import {
  createRoot,
  effect,
  type Dispose,
} from "@power-ui/core";
import { remove } from "./insert.js";

/**
 * Conditionally mount a DOM subtree.
 * When `when()` is false, the subtree is disposed and removed.
 *
 * @example
 * ```ts
 * show(parent, () => open(), () => h("div", null, "Hello"));
 * ```
 */
export function show(
  parent: ParentNode,
  when: () => boolean,
  factory: () => Node,
  anchor: Node | null = null,
): Dispose {
  let childDispose: Dispose | undefined;
  let node: Node | undefined;

  const stop = effect(() => {
    if (when()) {
      if (!node) {
        createRoot((dispose) => {
          childDispose = dispose;
          node = factory();
          parent.insertBefore(node, anchor);
        });
      }
    } else if (node) {
      childDispose?.();
      childDispose = undefined;
      remove(node);
      node = undefined;
    }
  });

  return () => {
    stop();
    childDispose?.();
    childDispose = undefined;
    if (node) {
      remove(node);
      node = undefined;
    }
  };
}
