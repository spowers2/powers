/**
 * Component spec schema (phase 2).
 * Specs reference token paths like "color.accent" / "control.height.md".
 * Phase 3 plugin will consume the same shapes.
 */

export type TokenPath = string;

export type ComponentVariant = {
  name: string;
  /** Token path overrides for this variant */
  tokens?: Record<string, TokenPath | string | number>;
  /** Freeform notes for designers */
  notes?: string;
};

export type ComponentSize = {
  name: string;
  tokens?: Record<string, TokenPath | string | number>;
};

export type ComponentSpec = {
  /** Match @powers/ui export name */
  name: string;
  description?: string;
  /** Default auto-layout direction when built in Figma */
  layout?: "horizontal" | "vertical" | "none";
  /** Token bindings for the default variant/size */
  tokens: Record<string, TokenPath | string | number>;
  variants?: ComponentVariant[];
  sizes?: ComponentSize[];
  /** States designers should include as variants or properties */
  states?: Array<"default" | "hover" | "active" | "disabled" | "focus">;
};
