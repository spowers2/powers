import {
  createOwner,
  disposeOwner,
  effect,
  getActiveOwner,
  runWithOwner,
  type Dispose,
} from "@lab206/core";

/**
 * Values a reactive JSX child function may return.
 * Nodes mount as DOM; strings/numbers become text; nullish clears the slot.
 */
export type DynamicChild =
  | Node
  | DocumentFragment
  | string
  | number
  | boolean
  | null
  | undefined
  | DynamicChild[];

/**
 * Mount a reactive child that may return **text or DOM nodes**.
 *
 * Previously function children were always treated as text via `String(value)`,
 * which produced `[object HTMLParagraphElement]` when a node was returned
 * (common for Tabs / Accordion / List content).
 *
 * Uses a `display: contents` host so layout is unaffected.
 *
 * **Tracking isolation (FOUNDATION):** `get()` still tracks the parent effect
 * for remount keys (e.g. `selected()` in a Dialog body). Component setup uses
 * `isolateTracking` via jsx/`h`/`component()`. Node trees are owned by a nested
 * owner and disposed on remount so Input effects do not leak.
 */
export function bindDynamic(
  parent: ParentNode,
  get: () => DynamicChild,
): Dispose {
  const host = document.createElement("span");
  host.setAttribute("data-pu-dyn", "");
  // contents: children participate in parent layout as if unwrapped
  (host.style as CSSStyleDeclaration).display = "contents";
  parent.appendChild(host);

  let textNode: Text | null = null;
  let mode: "empty" | "text" | "nodes" = "empty";
  let childDispose: Dispose | undefined;

  const stop = effect(() => {
    // Nested owner: effects created while building nodes are disposed on remount.
    // Do NOT use createRoot here — that clears activeNode and would stop the
    // parent function from tracking remount keys like selected().
    const owner = createOwner(getActiveOwner());
    let value!: DynamicChild;
    runWithOwner(owner, () => {
      value = get();
    });

    const disposeOwned = () => {
      disposeOwner(owner);
    };

    if (value == null || value === false || value === true) {
      childDispose?.();
      childDispose = undefined;
      disposeOwned();
      host.replaceChildren();
      textNode = null;
      mode = "empty";
      return;
    }

    if (typeof value === "string" || typeof value === "number") {
      childDispose?.();
      childDispose = undefined;
      disposeOwned(); // text path owns nothing reactive from get()
      const s = String(value);
      if (mode === "text" && textNode) {
        textNode.data = s;
      } else {
        host.replaceChildren();
        textNode = document.createTextNode(s);
        host.appendChild(textNode);
        mode = "text";
      }
      return;
    }

    // Nodes / arrays — never String(object)
    childDispose?.();
    childDispose = disposeOwned;
    textNode = null;
    mode = "nodes";
    host.replaceChildren();
    appendValue(host, value);
  });

  return () => {
    stop();
    childDispose?.();
    childDispose = undefined;
  };
}

function appendValue(parent: ParentNode, value: DynamicChild): void {
  if (value == null || value === false || value === true) return;

  if (typeof value === "string" || typeof value === "number") {
    parent.appendChild(document.createTextNode(String(value)));
    return;
  }

  // Prefer nodeType over instanceof — DocumentFragment may be missing in some test envs
  if (
    typeof value === "object" &&
    value !== null &&
    "nodeType" in (value as object) &&
    typeof (value as Node).nodeType === "number"
  ) {
    parent.appendChild(value as Node);
    return;
  }

  if (Array.isArray(value)) {
    for (const item of value) appendValue(parent, item);
  }
  // Non-node objects are ignored (avoids "[object HTML…]")
}
