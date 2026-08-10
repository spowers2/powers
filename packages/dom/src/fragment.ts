import type { Child } from "./h.js";
import { text } from "./h.js";

/** Normalize JSX children into a flat list. */
export function normalizeChildren(children: unknown): Child[] {
  if (children == null || children === false || children === true) {
    return [];
  }
  if (Array.isArray(children)) {
    const out: Child[] = [];
    for (const child of children) {
      out.push(...normalizeChildren(child));
    }
    return out;
  }
  return [children as Child];
}

/** Append a Child to a parent (static node or reactive text). */
export function appendChild(parent: ParentNode, child: Child): void {
  if (child == null || child === false || child === true) return;
  if (typeof child === "function") {
    parent.appendChild(text(child));
    return;
  }
  if (typeof child === "string" || typeof child === "number") {
    parent.appendChild(document.createTextNode(String(child)));
    return;
  }
  parent.appendChild(child);
}

/**
 * JSX Fragment — groups children without a wrapper element.
 * Returns a DocumentFragment (children move into the parent on insert).
 */
export function Fragment(props: { children?: unknown }): DocumentFragment {
  const frag = document.createDocumentFragment();
  for (const child of normalizeChildren(props.children)) {
    appendChild(frag, child);
  }
  return frag;
}
