/**
 * @power-ui/dom
 *
 * Thin, explicit DOM bindings over @power-ui/core.
 *
 * Learn order:
 *   mount → h / text → bind* / on → show → list
 */

export { mount } from "./mount.js";
export type { MountResult } from "./mount.js";

export { h, text } from "./h.js";
export type { Child, Props } from "./h.js";

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
