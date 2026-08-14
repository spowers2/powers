/**
 * Runtime surface injected into the Lab preview iframe.
 * Keep this list learnable — mirrors public package exports users should know.
 */
import * as core from "@power-ux/core";
import * as animate from "@power-ux/animate";
import { createGsapBridge } from "@power-ux/animate";
import * as dom from "@power-ux/dom";
import * as ui from "@power-ux/ui";
import gsap from "gsap";
// Ensure design tokens exist in the iframe document when UI is used
import "@power-ux/ui/theme.css";

const gsapBridge = createGsapBridge(gsap);

export type PowerLabApi = typeof core &
  typeof animate &
  typeof dom &
  typeof ui & {
    /** Convenience alias */
    Fragment: typeof dom.Fragment;
    /** Optional GSAP peer — same as `@power-ux/animate/gsap` */
    gsapAnimate: typeof gsapBridge.gsapAnimate;
    gsapFromTo: typeof gsapBridge.gsapFromTo;
  };

export function createLabApi(): PowerLabApi {
  // Spread ui before dom so form helpers never clobber DOM bindText/bindAttr.
  return {
    ...core,
    ...animate,
    ...ui,
    ...dom,
    Fragment: dom.Fragment,
    gsapAnimate: gsapBridge.gsapAnimate,
    gsapFromTo: gsapBridge.gsapFromTo,
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
  "createGsapBridge",
  "gsapAnimate",
  "gsapFromTo",
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
  "Dialog",
  "Tabs",
  "Progress",
  "Skeleton",
  "Avatar",
  "Tooltip",
  "Toaster",
  "createToaster",
  "Popover",
  "Menu",
  "Kbd",
  "Combobox",
  "Command",
  "Accordion",
  "Drawer",
  "Breadcrumb",
  "Pagination",
  "RadioGroup",
  "Slider",
  "NumberInput",
  "ToggleGroup",
  "List",
  "Table",
  "Empty",
  "Stat",
  "Steps",
  "Timeline",
  "Chip",
  "ScrollArea",
  "Collapse",
  "AspectRatio",
  "Link",
  "Transition",
  "createTheme",
  "createDensity",
  "cx",
  "createStyleSheet",
  "styleVars",
  "trapFocus",
  // form helpers
  "firstError",
  "required",
  "minLength",
  "maxLength",
  "emailFormat",
  "matches",
  "validateForm",
  "bindInput",
  "bindString",
  "bindSelect",
  "bindChecked",
  "asSelectBind",
  "createField",
  "eventValue",
  "eventChecked",
  // motion
  "MOTION_PRESETS",
  "motionVars",
] as const;
