import { isolateTracking } from "@lab206/core";
import { bindAttr, bindClass, bindProp, bindStyle, bindText } from "./bind.js";
import { bindDynamic, type DynamicChild } from "./dynamic.js";
import { on } from "./on.js";
import { createProps } from "./props.js";

export type Child =
  | Node
  | DocumentFragment
  | string
  | number
  | boolean
  | null
  | undefined
  | (() => DynamicChild);

export type FunctionComponent<P = Record<string, unknown>> = (
  props: P,
) => Node | DocumentFragment | null | undefined;

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
  children?: unknown;
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

export const SVG_NS = "http://www.w3.org/2000/svg";

/**
 * SVG-only tags (and `svg` itself). Created with createElementNS so
 * `<svg><path/></svg>` renders as real vector graphics.
 *
 * Dual-namespace tags (`a`, `script`, `style`, `title`, …) stay HTML —
 * put them in HTML, or nest HTML inside `<foreignObject>`.
 */
const SVG_TAGS = new Set([
  "svg",
  "animate",
  "animateMotion",
  "animateTransform",
  "circle",
  "clipPath",
  "defs",
  "desc",
  "ellipse",
  "feBlend",
  "feColorMatrix",
  "feComponentTransfer",
  "feComposite",
  "feConvolveMatrix",
  "feDiffuseLighting",
  "feDisplacementMap",
  "feDistantLight",
  "feDropShadow",
  "feFlood",
  "feFuncA",
  "feFuncB",
  "feFuncG",
  "feFuncR",
  "feGaussianBlur",
  "feImage",
  "feMerge",
  "feMergeNode",
  "feMorphology",
  "feOffset",
  "fePointLight",
  "feSpecularLighting",
  "feSpotLight",
  "feTile",
  "feTurbulence",
  "filter",
  "foreignObject",
  "g",
  "image",
  "line",
  "linearGradient",
  "marker",
  "mask",
  "metadata",
  "mpath",
  "path",
  "pattern",
  "polygon",
  "polyline",
  "radialGradient",
  "rect",
  "set",
  "stop",
  "switch",
  "symbol",
  "text",
  "textPath",
  "tspan",
  "use",
  "view",
]);

export function isSvgTag(tag: string): boolean {
  return SVG_TAGS.has(tag);
}

/** Set class on HTML or SVG (SVGElement.className is SVGAnimatedString). */
export function setClassName(el: Element, value: string): void {
  if (el.namespaceURI === SVG_NS) {
    el.setAttribute("class", value);
  } else {
    (el as HTMLElement).className = value;
  }
}

/**
 * Create an element — or invoke a function component.
 *
 * Classic JSX (`jsxFactory: "h"`) compiles `<App />` to `h(App, props)`.
 * Automatic runtime uses `jsx()` which also supports function types.
 *
 * SVG tags use the SVG namespace so paths/circles actually paint.
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
): HTMLElement | SVGElement;

export function h<P extends Record<string, unknown>>(
  tag: FunctionComponent<P>,
  props?: (P & Props) | null,
  ...children: Child[]
): Node | DocumentFragment;

export function h(
  tag: string | FunctionComponent,
  props?: Props | null,
  ...children: Child[]
): Node | DocumentFragment {
  // Function component (classic JSX: h(App, props, ...children))
  if (typeof tag === "function") {
    const raw: Record<string, unknown> = { ...(props ?? {}) };
    if (children.length === 1) {
      raw.children = children[0];
    } else if (children.length > 1) {
      raw.children = children;
    }
    // isolateTracking: setup reads must not subscribe parent bindDynamic (forms in Dialog)
    const result = isolateTracking(() => tag(createProps(raw) as never));
    if (result == null) {
      return document.createComment("powers");
    }
    return result;
  }

  if (typeof tag !== "string" || tag === "") {
    throw new Error(
      `[powers/dom] h() expected a tag name string or component function, got: ${typeof tag}`,
    );
  }

  const el = isSvgTag(tag)
    ? document.createElementNS(SVG_NS, tag)
    : document.createElement(tag);

  if (props) {
    applyProps(el, props);
  }

  for (const child of children) {
    appendChild(el, child);
  }

  // Also support props.children (automatic runtime path sometimes)
  if (props?.children != null && children.length === 0) {
    const c = props.children;
    if (Array.isArray(c)) {
      for (const item of c) appendChild(el, item as Child);
    } else {
      appendChild(el, c as Child);
    }
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

function applyProps(el: Element, props: Props): void {
  for (const key of Object.keys(props)) {
    if (RESERVED.has(key)) continue;
    const value = props[key];

    if (key.startsWith("on") && key.length > 2 && typeof value === "function") {
      // onClick → click, onMouseDown → mousedown
      const event = key.slice(2).toLowerCase();
      on(el as HTMLElement | SVGElement, event, value as EventListener);
      continue;
    }

    if (typeof value === "function") {
      if (isDomProp(key) && el.namespaceURI !== SVG_NS) {
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

    if (isDomProp(key) && el.namespaceURI !== SVG_NS) {
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
      setClassName(el, classValue);
    }
  }

  if (props.style !== undefined) {
    if (typeof props.style === "function") {
      bindStyle(el as HTMLElement | SVGElement, props.style);
    } else if (props.style) {
      bindStyle(el as HTMLElement | SVGElement, () => props.style as Record<string, string | number>);
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
    props.ref(el as HTMLElement);
  }
}

function appendChild(parent: ParentNode, child: Child): void {
  if (child == null || child === false || child === true) return;
  if (typeof child === "function") {
    // May return text *or* DOM nodes (Tabs/Accordion content, etc.)
    bindDynamic(parent, child as () => DynamicChild);
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
  "hidden",
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
  if (key.startsWith("aria")) {
    return key.replace(/([A-Z])/g, "-$1").toLowerCase();
  }
  if (key.startsWith("data") && key.length > 4 && key[4] !== "-") {
    return key.replace(/([A-Z])/g, "-$1").toLowerCase();
  }
  return key;
}
