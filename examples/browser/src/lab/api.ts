/**
 * Runtime surface injected into the Lab preview iframe.
 * Keep this list learnable — mirrors public package exports users should know.
 */
import * as core from "@power-ui/core";
import * as animate from "@power-ui/animate";
import * as dom from "@power-ui/dom";
import * as ui from "@power-ui/ui";
// Ensure design tokens exist in the iframe document when UI is used
import "@power-ui/ui/theme.css";

export type PowerLabApi = typeof core &
  typeof animate &
  typeof dom &
  typeof ui & {
    /** Convenience alias */
    Fragment: typeof dom.Fragment;
  };

export function createLabApi(): PowerLabApi {
  return {
    ...core,
    ...animate,
    ...dom,
    ...ui,
    Fragment: dom.Fragment,
  };
}

/** Names destructured into the user sandbox (order doesn't matter). */
export const LAB_API_KEYS = [
  // core
  "signal",
  "computed",
  "effect",
  "batch",
  "flush",
  "untrack",
  "store",
  "resource",
  "createRoot",
  "onError",
  // animate
  "animate",
  "spring",
  "cancel",
  // dom
  "mount",
  "h",
  "text",
  "Fragment",
  "component",
  "For",
  "Show",
  "bindText",
  "bindAttr",
  "bindProp",
  "bindClass",
  "bindStyle",
  "on",
  "show",
  "list",
  "mergeProps",
  "splitProps",
  "createProps",
  // ui
  "Button",
  "Input",
  "Textarea",
  "Select",
  "Field",
  "Label",
  "Switch",
  "Checkbox",
  "Stack",
  "Text",
  "Card",
  "Badge",
  "Container",
  "Grid",
  "Code",
  "Alert",
  "Divider",
  "Spinner",
  "createTheme",
  "createDensity",
  "cx",
] as const;
