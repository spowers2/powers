/**
 * Automatic JSX runtime for Power UI.
 *
 * Vite / TypeScript:
 *   jsx: "react-jsx"
 *   jsxImportSource: "@power-ui/dom"
 *
 * Compiles:
 *   <button onClick={...}>{() => count()}</button>
 * into:
 *   jsx("button", { onClick: ..., children: () => count() })
 */
import { h, type Props } from "./h.js";
import { Fragment, normalizeChildren } from "./fragment.js";

export { Fragment };

export type FunctionComponent<P = Record<string, unknown>> = (
  props: P,
) => Node | DocumentFragment | null | undefined;

export function jsx(
  type: string | FunctionComponent<Record<string, unknown>>,
  props: (Props & { children?: unknown }) | null,
  _key?: string | number,
): Node | DocumentFragment {
  return create(type, props);
}

/** Same as jsx — esbuild uses jsxs for static multi-child elements. */
export function jsxs(
  type: string | FunctionComponent<Record<string, unknown>>,
  props: (Props & { children?: unknown }) | null,
  _key?: string | number,
): Node | DocumentFragment {
  return create(type, props);
}

/** Dev runtime alias (same behavior; no extra checks yet). */
export function jsxDEV(
  type: string | FunctionComponent<Record<string, unknown>>,
  props: (Props & { children?: unknown }) | null,
  _key?: string | number,
): Node | DocumentFragment {
  return create(type, props);
}

function create(
  type: string | FunctionComponent<Record<string, unknown>>,
  props: (Props & { children?: unknown }) | null,
): Node | DocumentFragment {
  const p = props ?? {};
  const { children, ...rest } = p;

  if (typeof type === "function") {
    // Function components receive props including children.
    const result = type(p as Record<string, unknown>);
    if (result == null) {
      return document.createComment("power-ui");
    }
    return result;
  }

  const childList = normalizeChildren(children);
  return h(type, rest as Props, ...childList);
}

// JSX namespace for TypeScript (consumed via jsxImportSource).
export namespace JSX {
  export type Element = Node | DocumentFragment;
  export type ElementType = string | FunctionComponent<any>;

  export interface ElementAttributesProperty {
    props: unknown;
  }
  export interface ElementChildrenAttribute {
    children: unknown;
  }

  export type LibraryManagedAttributes<C, P> = P;

  export interface IntrinsicAttributes {
    key?: string | number;
  }

  /** Allow any HTML tag + Power UI reactive props (functions). */
  export type IntrinsicElements = {
    [K in keyof HTMLElementTagNameMap]: Props & {
      children?: unknown;
    } & {
      [attr: string]: unknown;
    };
  } & {
    [elemName: string]: Props & {
      children?: unknown;
      [attr: string]: unknown;
    };
  };
}
