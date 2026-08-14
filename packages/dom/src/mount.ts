import { createRoot, type Dispose } from "@powers/core";
import { remove } from "./insert.js";

export type MountResult = Node | Node[] | null | undefined | void;

/**
 * Mount a reactive app into a parent node.
 * Returns a dispose function that tears down effects and removes mounted nodes.
 *
 * @example
 * ```ts
 * const stop = mount(document.getElementById("app")!, () => {
 *   const count = signal(0);
 *   return h("button", {
 *     onClick: () => count.update(n => n + 1),
 *     text: () => `Count: ${count()}`,
 *   });
 * });
 * ```
 */
export function mount(
  parent: ParentNode,
  app: () => MountResult,
): Dispose {
  const nodes: Node[] = [];
  let disposeRoot!: Dispose;

  createRoot((dispose) => {
    disposeRoot = dispose;
    const result = app();
    if (result == null) return;
    const list = Array.isArray(result) ? result : [result];
    for (const node of list) {
      parent.appendChild(node);
      nodes.push(node);
    }
  });

  return () => {
    disposeRoot();
    for (const node of nodes) {
      remove(node);
    }
    nodes.length = 0;
  };
}
