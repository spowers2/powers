/**
 * Automatic JSX runtime for Powers.
 *
 * Vite / TypeScript:
 *   jsx: "react-jsx"
 *   jsxImportSource: "@lab206/dom"
 *
 * Function components receive **reactive props** via `createProps`
 * (unless they already wrapped themselves with `component()`).
 */
import { isolateTracking } from "@lab206/core";
import { h, type Props } from "./h.js";
import { Fragment, normalizeChildren } from "./fragment.js";
import { createProps } from "./props.js";

export { Fragment };

export type FunctionComponent<P = Record<string, unknown>> = (
  props: P,
) => Node | DocumentFragment | null | undefined;

/** Marker set on components that already apply createProps. */
export const REACTIVE_PROPS = Symbol.for("powers.reactiveProps");

export function jsx(
  type: string | FunctionComponent<Record<string, unknown>>,
  props: (Props & { children?: unknown }) | null,
  _key?: string | number,
): Node | DocumentFragment {
  return create(type, props);
}

export function jsxs(
  type: string | FunctionComponent<Record<string, unknown>>,
  props: (Props & { children?: unknown }) | null,
  _key?: string | number,
): Node | DocumentFragment {
  return create(type, props);
}

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
    // Always pass through createProps so bare function components get
    // reactive field access. component() also wraps — double-wrap is OK
    // (outer raw object, inner Proxy of raw; component's createProps runs first).
    //
    // Setup under isolateTracking: construction reads (e.g. seeding a draft
    // from a store) do not subscribe a parent bindDynamic / Dialog slot —
    // that remount wiped focused inputs on every keystroke. Nested effects
    // and `{() => …}` still track (unlike untrack).
    const reactive = createProps(p as Record<string, unknown>);
    const result = isolateTracking(() =>
      type(reactive as Record<string, unknown>),
    );
    if (result == null) {
      return document.createComment("powers");
    }
    return result;
  }

  const childList = normalizeChildren(children);
  return h(type, rest as Props, ...childList);
}

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
