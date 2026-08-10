import { bindAttr, bindClass, bindProp, bindStyle, bindText } from "./bind.js";
import { on } from "./on.js";

export type Child =
  | Node
  | string
  | number
  | boolean
  | null
  | undefined
  | (() => string | number | boolean | null | undefined);

export type Props = {
  /** Static or reactive text content (sets textContent). */
  text?: string | number | (() => string | number | boolean | null | undefined);
  class?: string | (() => string | Record<string, boolean | undefined | null> | null | undefined);
  className?: string | (() => string | Record<string, boolean | undefined | null> | null | undefined);
  style?:
    | Record<string, string | number | null | undefined>
    | (() => Record<string, string | number | null | undefined> | null | undefined);
  /** ref callback with the created element */
  ref?: (el: HTMLElement) => void;
  [key: string]: unknown;
};

const RESERVED = new Set([
  "text",
  "class",
  "className",
  "style",
  "ref",
  "children",
]);

/**
 * Create an element with optional reactive props and children.
 *
 * Event props: `onClick`, `onInput`, … → `click`, `input`, …
 * Reactive props: pass a function `() => value` for attr/text/class/style.
 *
 * @example
 * ```ts
 * const btn = h("button", {
 *   type: "button",
 *   class: () => (active() ? "on" : "off"),
 *   onClick: () => count.update(n => n + 1),
 *   text: () => `Count: ${count()}`,
 * });
 * ```
 */
export function h<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  props?: Props | null,
  ...children: Child[]
): HTMLElementTagNameMap[K];

export function h(
  tag: string,
  props?: Props | null,
  ...children: Child[]
): HTMLElement;

export function h(
  tag: string,
  props?: Props | null,
  ...children: Child[]
): HTMLElement {
  const el = document.createElement(tag);

  if (props) {
    applyProps(el, props);
  }

  for (const child of children) {
    appendChild(el, child);
  }

  return el;
}

/** Create a reactive or static text node. */
export function text(
  value: string | number | (() => string | number | boolean | null | undefined),
): Text {
  const node = document.createTextNode("");
  if (typeof value === "function") {
    bindText(node, value);
  } else {
    node.data = String(value);
  }
  return node;
}

function applyProps(el: HTMLElement, props: Props): void {
  for (const key of Object.keys(props)) {
    if (RESERVED.has(key)) continue;
    const value = props[key];

    if (key.startsWith("on") && key.length > 2 && typeof value === "function") {
      // onClick → click, onMouseDown → mousedown
      const event = key.slice(2).toLowerCase();
      on(el, event, value as EventListener);
      continue;
    }

    if (typeof value === "function") {
      // Reactive attribute by default; known props use bindProp.
      if (isDomProp(key)) {
        bindProp(el, key, value as () => unknown);
      } else {
        bindAttr(
          el,
          toAttrName(key),
          value as () => string | number | boolean | null | undefined,
        );
      }
      continue;
    }

    if (isDomProp(key)) {
      (el as unknown as Record<string, unknown>)[key] = value;
    } else if (value === true) {
      el.setAttribute(toAttrName(key), "");
    } else if (value !== false && value != null) {
      el.setAttribute(toAttrName(key), String(value));
    }
  }

  const classValue = props.class ?? props.className;
  if (classValue !== undefined) {
    if (typeof classValue === "function") {
      bindClass(el, classValue);
    } else if (classValue != null) {
      el.className = classValue;
    }
  }

  if (props.style !== undefined) {
    if (typeof props.style === "function") {
      bindStyle(el, props.style);
    } else if (props.style) {
      bindStyle(el, () => props.style as Record<string, string | number>);
    }
  }

  if (props.text !== undefined) {
    if (typeof props.text === "function") {
      bindText(el, props.text);
    } else {
      el.textContent = String(props.text);
    }
  }

  if (typeof props.ref === "function") {
    props.ref(el);
  }
}

function appendChild(parent: ParentNode, child: Child): void {
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

const DOM_PROPS = new Set([
  "value",
  "checked",
  "selected",
  "disabled",
  "readOnly",
  "multiple",
  "muted",
  "controls",
  "defaultValue",
  "defaultChecked",
  "innerHTML",
  "tabIndex",
  "spellcheck",
]);

function isDomProp(name: string): boolean {
  return DOM_PROPS.has(name);
}

function toAttrName(key: string): string {
  // className already handled; aria* / data* stay as-is via React-like? keep lowercase dataset:
  if (key.startsWith("aria")) {
    return key.replace(/([A-Z])/g, "-$1").toLowerCase();
  }
  if (key.startsWith("data") && key.length > 4 && key[4] !== "-") {
    return key.replace(/([A-Z])/g, "-$1").toLowerCase();
  }
  return key;
}
