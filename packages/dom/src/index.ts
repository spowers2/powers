/**
 * @power-ui/dom
 *
 * Thin, explicit DOM bindings over @power-ui/core.
 *
 * Learn order:
 *   mount → h / JSX → component → reactive props → Show / For
 */

export { mount } from "./mount.js";
export type { MountResult } from "./mount.js";

export { h, text } from "./h.js";
export type { Child, Props, FunctionComponent } from "./h.js";

export { Fragment, normalizeChildren, appendChild } from "./fragment.js";

export {
  bindText,
  bindAttr,
  bindProp,
  bindClass,
  bindStyle,
} from "./bind.js";

export { on } from "./on.js";
export { show } from "./show.js";
export { list } from "./list.js";
export type { ListOptions } from "./list.js";
export { insert, remove } from "./insert.js";

export { component, Show, For } from "./component.js";
export type {
  Component,
  ComponentProps,
  ComponentSetup,
} from "./component.js";

export {
  createProps,
  mergeProps,
  splitProps,
  unwrapProp,
  isSignal,
  isReactiveProps,
} from "./props.js";
export type { ReactiveProps } from "./props.js";
