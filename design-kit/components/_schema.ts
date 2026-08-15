/**
 * Component spec schema (phase 2).
 *
 * Specs are the contract between:
 * - Designers building the Figma UI kit by hand
 * - Phase-3 plugin generating component sets
 * - Runtime @powers/ui (names + variants must match)
 *
 * Token paths use dotted form from design-kit/tokens/source.ts
 * e.g. "color.accent", "control.height.md", "radius.md"
 */

/** Reference into tokens export (dot path). */
export type TokenPath = string;

/** Literal or token-backed value for Figma fills, sizes, etc. */
export type SpecValue = TokenPath | string | number | boolean;

export type ComponentState =
  | "default"
  | "hover"
  | "active"
  | "disabled"
  | "focus"
  | "invalid"
  | "checked"
  | "open";

/** Figma component property (Variant / Boolean / Text / Instance swap). */
export type FigmaProperty = {
  name: string;
  kind: "variant" | "boolean" | "text" | "instance-swap";
  /** For variant: option list. First = default. */
  options?: string[];
  default?: string | boolean;
  description?: string;
};

export type LayerRole =
  | "root"
  | "label"
  | "icon"
  | "text"
  | "input"
  | "track"
  | "thumb"
  | "panel"
  | "backdrop"
  | "close"
  | "meta"
  | "slot"
  | "divider"
  | "media";

export type SpecLayer = {
  name: string;
  role: LayerRole;
  /** Auto-layout on this frame */
  layout?: "horizontal" | "vertical" | "none";
  /** Token / literal bindings for this layer */
  tokens?: Record<string, SpecValue>;
  /** Nested layers */
  children?: SpecLayer[];
  notes?: string;
};

export type ComponentVariant = {
  name: string;
  /** Overrides applied when this variant is selected (merge over base tokens) */
  tokens?: Record<string, SpecValue>;
  notes?: string;
};

export type ComponentSize = {
  name: string;
  tokens?: Record<string, SpecValue>;
  notes?: string;
};

export type ComponentCategory =
  | "foundations"
  | "actions"
  | "forms"
  | "data-display"
  | "feedback"
  | "overlays"
  | "navigation"
  | "layout";

export type ComponentSpec = {
  /** Match @powers/ui export name (PascalCase) */
  name: string;
  /** CSS root class e.g. pu-btn */
  cssClass: string;
  category: ComponentCategory;
  description?: string;
  /** Source file under packages/ui/src/components/ */
  source?: string;
  /** Figma page / section for the kit */
  figmaPage?: string;
  /** Default auto-layout on the component root */
  layout?: "horizontal" | "vertical" | "none";
  /** Suggested Figma component properties */
  properties?: FigmaProperty[];
  /** Base token bindings (default variant + default size) */
  tokens: Record<string, SpecValue>;
  /** Visual / interaction variants */
  variants?: ComponentVariant[];
  /** Size scale */
  sizes?: ComponentSize[];
  /** States to include as properties or separate variants */
  states?: ComponentState[];
  /** Layer tree for rebuilding in Figma / plugin */
  structure?: SpecLayer[];
  /** Sample instance text for the kit page */
  sampleContent?: string;
  /** Priority when building the kit (1 = first) */
  buildOrder?: number;
  notes?: string;
};

export type ComponentCatalog = {
  version: string;
  phase: 2;
  description: string;
  tokenSource: string;
  categories: ComponentCategory[];
  components: ComponentSpec[];
};
