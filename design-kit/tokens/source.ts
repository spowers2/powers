/**
 * Powers design-kit token source (phase 1 → Figma / Tokens Studio).
 *
 * Mirrors packages/ui/src/styles/tokens.css.
 * color-mix() values are pre-resolved to hex/rgba so Figma can import them.
 * When CSS tokens change, update this file and run:
 *   pnpm design-kit:build
 *
 * Targets all three phases:
 * - Phase 1: Tokens Studio + Figma Variables JSON
 * - Phase 2: component specs reference these token paths
 * - Phase 3: plugin applies variables from the same paths
 */

export type TokenType =
  | "color"
  | "spacing"
  | "borderRadius"
  | "fontFamilies"
  | "fontSizes"
  | "fontWeights"
  | "lineHeights"
  | "letterSpacing"
  | "boxShadow"
  | "sizing"
  | "opacity"
  | "other";

export type ShadowLayer = {
  color: string;
  type: "dropShadow" | "innerShadow";
  x: number;
  y: number;
  blur: number;
  spread: number;
};

export type TokenValue = string | ShadowLayer | ShadowLayer[];

export type FlatToken = {
  /** Path segments e.g. ["color", "brand", "500"] */
  path: string[];
  value: TokenValue;
  type: TokenType;
  description?: string;
};

export type ThemeId =
  | "instrument/light"
  | "instrument/dark"
  | "dual/light"
  | "dual/dark";

function t(
  path: string[],
  value: TokenValue,
  type: TokenType,
  description?: string,
): FlatToken {
  const token: FlatToken = { path, value, type };
  if (description) token.description = description;
  return token;
}

export function getRaw(token: FlatToken): TokenValue {
  return token.value;
}

/** Layout / type / motion — shared by every theme. */
const foundation: FlatToken[] = [
  t(["space", "0"], "0", "spacing"),
  t(["space", "1"], "4", "spacing"),
  t(["space", "2"], "8", "spacing"),
  t(["space", "3"], "12", "spacing"),
  t(["space", "4"], "16", "spacing"),
  t(["space", "5"], "20", "spacing"),
  t(["space", "6"], "24", "spacing"),
  t(["space", "8"], "32", "spacing"),
  t(["space", "10"], "40", "spacing"),
  t(["space", "12"], "48", "spacing"),

  t(["radius", "sm"], "5", "borderRadius"),
  t(["radius", "md"], "8", "borderRadius"),
  t(["radius", "lg"], "12", "borderRadius"),
  t(["radius", "xl"], "16", "borderRadius"),
  t(["radius", "full"], "9999", "borderRadius"),

  t(["font", "family", "sans"], "DM Sans", "fontFamilies"),
  t(["font", "family", "display"], "DM Sans", "fontFamilies"),
  t(["font", "family", "mono"], "IBM Plex Mono", "fontFamilies"),
  t(["font", "size", "xs"], "12", "fontSizes"),
  t(["font", "size", "sm"], "14", "fontSizes"),
  t(["font", "size", "md"], "16", "fontSizes"),
  t(["font", "size", "lg"], "18", "fontSizes"),
  t(["font", "size", "xl"], "22", "fontSizes"),
  t(["font", "size", "2xl"], "28", "fontSizes"),
  t(["font", "size", "3xl"], "37.6", "fontSizes"),
  t(["font", "weight", "medium"], "500", "fontWeights"),
  t(["font", "weight", "semibold"], "600", "fontWeights"),
  t(["font", "weight", "bold"], "700", "fontWeights"),
  t(["font", "leading", "default"], "1.55", "lineHeights"),
  t(["font", "leading", "tight"], "1.15", "lineHeights"),
  t(["font", "tracking", "tight"], "-0.4", "letterSpacing"),
  t(["font", "tracking", "display"], "-0.56", "letterSpacing"),

  t(["control", "height", "sm"], "32", "sizing"),
  t(["control", "height", "md"], "40", "sizing"),
  t(["control", "height", "lg"], "48", "sizing"),
  t(["control", "paddingX"], "15.2", "spacing"),
  t(["control", "fieldGap"], "8", "spacing"),
  t(["control", "labelSize"], "14", "fontSizes"),

  t(["motion", "duration", "fast"], "130ms", "other"),
  t(["motion", "duration", "default"], "220ms", "other"),
  t(["motion", "duration", "slow"], "380ms", "other"),
  t(["motion", "ease", "default"], "cubic-bezier(0.2, 0.8, 0.2, 1)", "other"),
  t(["motion", "ease", "out"], "cubic-bezier(0.16, 1, 0.3, 1)", "other"),
  t(["motion", "ease", "spring"], "cubic-bezier(0.34, 1.25, 0.64, 1)", "other"),

  t(["z", "overlay"], "1000", "other"),
  t(["z", "toast"], "1100", "other"),
];

const instrumentPrimitives: FlatToken[] = [
  t(["color", "brand", "50"], "#eef3f9", "color"),
  t(["color", "brand", "100"], "#d4e0ee", "color"),
  t(["color", "brand", "200"], "#9bb6d4", "color"),
  t(["color", "brand", "300"], "#5a86b5", "color"),
  t(["color", "brand", "400"], "#2f5f94", "color"),
  t(["color", "brand", "500"], "#0a2744", "color", "Primary navy"),
  t(["color", "brand", "600"], "#061c33", "color"),
  t(["color", "brand", "700"], "#041528", "color"),
  t(["color", "brand", "800"], "#030f1c", "color"),
  t(["color", "brand", "900"], "#020a14", "color"),

  t(["color", "gray", "0"], "#fcfdff", "color"),
  t(["color", "gray", "50"], "#f4f6fa", "color"),
  t(["color", "gray", "100"], "#e8ecf3", "color"),
  t(["color", "gray", "200"], "#d2d9e5", "color"),
  t(["color", "gray", "300"], "#a8b2c2", "color"),
  t(["color", "gray", "400"], "#7c8799", "color"),
  t(["color", "gray", "500"], "#5a6578", "color"),
  t(["color", "gray", "600"], "#434c5d", "color"),
  t(["color", "gray", "700"], "#313846", "color"),
  t(["color", "gray", "800"], "#1f2530", "color"),
  t(["color", "gray", "900"], "#12161e", "color"),
  t(["color", "gray", "950"], "#090c11", "color"),

  t(["color", "sage", "300"], "#8fd44f", "color"),
  t(["color", "sage", "400"], "#7ac936", "color"),
  t(["color", "sage", "500"], "#69be28", "color", "Live / success signal"),
  t(["color", "sage", "600"], "#4f9a1c", "color"),
  t(["color", "sage", "700"], "#3a7214", "color"),
  t(["color", "sage", "800"], "#2a5410", "color"),

  t(["color", "metal", "400"], "#c4c9d2", "color"),
  t(["color", "metal", "500"], "#9aa3b2", "color"),
  t(["color", "metal", "600"], "#6b7382", "color"),

  t(["color", "holo", "cyan"], "#2eb8c9", "color", "Focus / edge"),
  t(["color", "holo", "teal"], "#1f8f9c", "color"),
];

const dualPrimitives: FlatToken[] = [
  t(["color", "brand", "50"], "#f4f9ff", "color"),
  t(["color", "brand", "100"], "#e3f0fc", "color"),
  t(["color", "brand", "200"], "#b6d4f5", "color"),
  t(["color", "brand", "300"], "#6ba3e0", "color"),
  t(["color", "brand", "400"], "#2f78c4", "color"),
  t(["color", "brand", "500"], "#0a1e38", "color"),
  t(["color", "brand", "600"], "#06152a", "color"),
  t(["color", "brand", "700"], "#040f1e", "color"),
  t(["color", "brand", "800"], "#030a14", "color"),
  t(["color", "brand", "900"], "#01060d", "color"),
  t(["color", "gray", "0"], "#ffffff", "color"),
  t(["color", "gray", "50"], "#f7f9fc", "color"),
  t(["color", "gray", "100"], "#eef2f8", "color"),
  t(["color", "gray", "200"], "#d8e0ec", "color"),
  t(["color", "gray", "300"], "#a8b4c8", "color"),
  t(["color", "gray", "400"], "#7a879e", "color"),
  t(["color", "gray", "500"], "#5a6780", "color"),
  t(["color", "gray", "600"], "#424d63", "color"),
  t(["color", "gray", "700"], "#303a4c", "color"),
  t(["color", "gray", "800"], "#1d2433", "color"),
  t(["color", "gray", "900"], "#111722", "color"),
  t(["color", "gray", "950"], "#080b12", "color"),
  t(["color", "holo", "cyan"], "#06b6d4", "color"),
  t(["color", "holo", "teal"], "#0891b2", "color"),
  // sage / metal stay instrument defaults unless overridden
  t(["color", "sage", "300"], "#8fd44f", "color"),
  t(["color", "sage", "400"], "#7ac936", "color"),
  t(["color", "sage", "500"], "#69be28", "color"),
  t(["color", "sage", "600"], "#4f9a1c", "color"),
  t(["color", "sage", "700"], "#3a7214", "color"),
  t(["color", "sage", "800"], "#2a5410", "color"),
  t(["color", "metal", "400"], "#c4c9d2", "color"),
  t(["color", "metal", "500"], "#9aa3b2", "color"),
  t(["color", "metal", "600"], "#6b7382", "color"),
];

function shadow(
  path: string[],
  layers: ShadowLayer | ShadowLayer[],
): FlatToken {
  return t(path, layers, "boxShadow");
}

const instrumentLightSemantic: FlatToken[] = [
  t(["color", "bg"], "#f4f6fa", "color"),
  t(["color", "surface"], "#fcfdff", "color"),
  t(["color", "surface", "2"], "#e8ecf3", "color"),
  t(["color", "surface", "elevated"], "#fcfdff", "color"),
  t(["color", "surface", "sunken"], "#d5dce8", "color", "Resolved from color-mix"),
  t(["color", "border"], "#c9d1df", "color", "Resolved from color-mix"),
  t(["color", "border", "strong"], "#94a0b5", "color"),
  t(["color", "text"], "#0a2744", "color"),
  t(["color", "text", "muted"], "#4a5568", "color"),
  t(["color", "accent"], "#0a2744", "color"),
  t(["color", "accent", "hover"], "#061c33", "color"),
  t(["color", "accent", "fg"], "#f7fafc", "color"),
  t(["color", "signal"], "#69be28", "color"),
  t(["color", "success"], "#4f9a1c", "color"),
  t(["color", "danger"], "#b42318", "color"),
  t(["color", "danger", "fg"], "#fcfdff", "color"),
  t(["color", "focus"], "#2eb8c9", "color"),
  t(["color", "selection"], "rgba(46, 184, 201, 0.18)", "color"),
  t(["color", "control", "border"], "#9aabc0", "color"),
  t(["color", "soft", "bg"], "#f0f7e9", "color"),
  t(["color", "soft", "bgHover"], "#e6f3d8", "color"),
  t(["color", "soft", "fg"], "#1f3d2e", "color"),
  t(["color", "soft", "border"], "#b8c9b0", "color"),
  t(["color", "glass", "bg"], "rgba(252, 253, 255, 0.86)", "color"),
  t(["color", "glass", "border"], "#c5d2df", "color"),
  t(["color", "glow"], "rgba(47, 95, 148, 0.10)", "color"),
  t(["color", "glow", "2"], "rgba(105, 190, 40, 0.08)", "color"),
  t(["color", "glow", "holo"], "rgba(46, 184, 201, 0.10)", "color"),
  t(["color", "overlay", "scrim"], "rgba(10, 39, 68, 0.48)", "color"),
  shadow(["shadow", "xs"], {
    color: "rgba(10, 39, 68, 0.03)",
    type: "dropShadow",
    x: 0,
    y: 1,
    blur: 1,
    spread: 0,
  }),
  shadow(
    ["shadow", "sm"],
    [
      {
        color: "rgba(10, 39, 68, 0.03)",
        type: "dropShadow",
        x: 0,
        y: 1,
        blur: 2,
        spread: 0,
      },
      {
        color: "rgba(10, 39, 68, 0.04)",
        type: "dropShadow",
        x: 0,
        y: 2,
        blur: 6,
        spread: 0,
      },
    ],
  ),
  shadow(
    ["shadow", "md"],
    [
      {
        color: "rgba(10, 39, 68, 0.03)",
        type: "dropShadow",
        x: 0,
        y: 2,
        blur: 4,
        spread: 0,
      },
      {
        color: "rgba(10, 39, 68, 0.06)",
        type: "dropShadow",
        x: 0,
        y: 8,
        blur: 24,
        spread: 0,
      },
    ],
  ),
  shadow(
    ["shadow", "lg"],
    [
      {
        color: "rgba(10, 39, 68, 0.03)",
        type: "dropShadow",
        x: 0,
        y: 4,
        blur: 8,
        spread: 0,
      },
      {
        color: "rgba(10, 39, 68, 0.08)",
        type: "dropShadow",
        x: 0,
        y: 16,
        blur: 40,
        spread: 0,
      },
    ],
  ),
];

const instrumentDarkSemantic: FlatToken[] = [
  t(["color", "bg"], "#050a12", "color"),
  t(["color", "surface"], "#0b1220", "color"),
  t(["color", "surface", "2"], "#121b2c", "color"),
  t(["color", "surface", "elevated"], "#172234", "color"),
  t(["color", "surface", "sunken"], "#03060c", "color"),
  t(["color", "border"], "rgba(154, 168, 188, 0.28)", "color"),
  t(["color", "border", "strong"], "#6b8a9c", "color"),
  t(["color", "control", "border"], "rgba(182, 194, 212, 0.42)", "color"),
  t(["color", "text"], "#e8eef8", "color"),
  t(["color", "text", "muted"], "#a8b4c8", "color"),
  t(["color", "accent"], "#4a8fd4", "color"),
  t(["color", "accent", "hover"], "#6aa8e6", "color"),
  t(["color", "accent", "fg"], "#f7fafc", "color"),
  t(["color", "signal"], "#7ac936", "color"),
  t(["color", "success"], "#7ac936", "color"),
  t(["color", "danger"], "#f07178", "color"),
  t(["color", "danger", "fg"], "#1a0a0c", "color"),
  t(["color", "focus"], "#2eb8c9", "color"),
  t(["color", "selection"], "rgba(46, 184, 201, 0.22)", "color"),
  t(["color", "soft", "bg"], "#1a2e42", "color"),
  t(["color", "soft", "bgHover"], "#234060", "color"),
  t(["color", "soft", "fg"], "#c5ddf5", "color"),
  t(["color", "soft", "border"], "#3d6a94", "color"),
  t(["color", "glass", "bg"], "rgba(11, 18, 32, 0.78)", "color"),
  t(["color", "glass", "border"], "rgba(46, 184, 201, 0.14)", "color"),
  t(["color", "glow"], "rgba(90, 134, 181, 0.12)", "color"),
  t(["color", "glow", "2"], "rgba(105, 190, 40, 0.08)", "color"),
  t(["color", "glow", "holo"], "rgba(46, 184, 201, 0.10)", "color"),
  t(["color", "overlay", "scrim"], "rgba(0, 0, 0, 0.72)", "color"),
  shadow(["shadow", "xs"], {
    color: "rgba(0, 0, 0, 0.4)",
    type: "dropShadow",
    x: 0,
    y: 1,
    blur: 1,
    spread: 0,
  }),
  shadow(
    ["shadow", "sm"],
    [
      {
        color: "rgba(0, 0, 0, 0.35)",
        type: "dropShadow",
        x: 0,
        y: 1,
        blur: 2,
        spread: 0,
      },
      {
        color: "rgba(0, 0, 0, 0.28)",
        type: "dropShadow",
        x: 0,
        y: 2,
        blur: 8,
        spread: 0,
      },
    ],
  ),
  shadow(
    ["shadow", "md"],
    [
      {
        color: "rgba(0, 0, 0, 0.3)",
        type: "dropShadow",
        x: 0,
        y: 2,
        blur: 4,
        spread: 0,
      },
      {
        color: "rgba(0, 0, 0, 0.4)",
        type: "dropShadow",
        x: 0,
        y: 10,
        blur: 28,
        spread: 0,
      },
    ],
  ),
  shadow(
    ["shadow", "lg"],
    [
      {
        color: "rgba(0, 0, 0, 0.3)",
        type: "dropShadow",
        x: 0,
        y: 4,
        blur: 8,
        spread: 0,
      },
      {
        color: "rgba(0, 0, 0, 0.48)",
        type: "dropShadow",
        x: 0,
        y: 18,
        blur: 44,
        spread: 0,
      },
    ],
  ),
];

const dualLightSemantic: FlatToken[] = [
  t(["color", "bg"], "#f4f8fc", "color"),
  t(["color", "surface"], "#ffffff", "color"),
  t(["color", "surface", "2"], "#e8f4f8", "color"),
  t(["color", "surface", "elevated"], "#ffffff", "color"),
  t(["color", "surface", "sunken"], "#dceef4", "color"),
  t(["color", "border"], "#8fc5d4", "color"),
  t(["color", "border", "strong"], "#3a9bb0", "color"),
  t(["color", "text"], "#0a1e38", "color"),
  t(["color", "text", "muted"], "#3d4f63", "color"),
  t(["color", "accent"], "#0a1e38", "color"),
  t(["color", "accent", "hover"], "#06152a", "color"),
  t(["color", "accent", "fg"], "#ffffff", "color"),
  t(["color", "signal"], "#69be28", "color"),
  t(["color", "success"], "#3d7a16", "color"),
  t(["color", "danger"], "#b42318", "color"),
  t(["color", "danger", "fg"], "#fcfdff", "color"),
  t(["color", "focus"], "#06b6d4", "color"),
  t(["color", "selection"], "rgba(6, 182, 212, 0.32)", "color"),
  t(["color", "control", "border"], "#6a94a8", "color"),
  t(["color", "soft", "bg"], "#d4f4fa", "color"),
  t(["color", "soft", "bgHover"], "#b8eef8", "color"),
  t(["color", "soft", "fg"], "#0a5f73", "color"),
  t(["color", "soft", "border"], "#5eb0c4", "color"),
  t(["color", "glass", "bg"], "rgba(255, 255, 255, 0.88)", "color"),
  t(["color", "glass", "border"], "#a8d4e0", "color"),
  t(["color", "glow"], "rgba(6, 182, 212, 0.18)", "color"),
  t(["color", "glow", "2"], "rgba(34, 211, 238, 0.16)", "color"),
  t(["color", "glow", "holo"], "rgba(6, 182, 212, 0.20)", "color"),
  t(["color", "overlay", "scrim"], "rgba(10, 30, 56, 0.48)", "color"),
  shadow(["shadow", "xs"], {
    color: "rgba(6, 182, 212, 0.06)",
    type: "dropShadow",
    x: 0,
    y: 1,
    blur: 1,
    spread: 0,
  }),
  shadow(
    ["shadow", "sm"],
    [
      {
        color: "rgba(10, 30, 56, 0.03)",
        type: "dropShadow",
        x: 0,
        y: 1,
        blur: 2,
        spread: 0,
      },
      {
        color: "rgba(6, 182, 212, 0.10)",
        type: "dropShadow",
        x: 0,
        y: 2,
        blur: 10,
        spread: 0,
      },
    ],
  ),
  shadow(
    ["shadow", "md"],
    [
      {
        color: "rgba(10, 30, 56, 0.03)",
        type: "dropShadow",
        x: 0,
        y: 2,
        blur: 4,
        spread: 0,
      },
      {
        color: "rgba(6, 182, 212, 0.12)",
        type: "dropShadow",
        x: 0,
        y: 12,
        blur: 32,
        spread: 0,
      },
    ],
  ),
  shadow(
    ["shadow", "lg"],
    [
      {
        color: "rgba(10, 30, 56, 0.04)",
        type: "dropShadow",
        x: 0,
        y: 4,
        blur: 8,
        spread: 0,
      },
      {
        color: "rgba(6, 182, 212, 0.14)",
        type: "dropShadow",
        x: 0,
        y: 20,
        blur: 48,
        spread: 0,
      },
    ],
  ),
];

const dualDarkSemantic: FlatToken[] = [
  t(["color", "bg"], "#04080f", "color"),
  t(["color", "surface"], "#0a101c", "color"),
  t(["color", "surface", "2"], "#111a2a", "color"),
  t(["color", "surface", "elevated"], "#162033", "color"),
  t(["color", "surface", "sunken"], "#02050a", "color"),
  t(["color", "border"], "rgba(148, 163, 184, 0.26)", "color"),
  t(["color", "border", "strong"], "#3a9bb0", "color"),
  t(["color", "control", "border"], "rgba(165, 180, 200, 0.40)", "color"),
  t(["color", "text"], "#eef3fb", "color"),
  t(["color", "text", "muted"], "#a8b6c9", "color"),
  t(["color", "accent"], "#38bdf8", "color"),
  t(["color", "accent", "hover"], "#7dd3fc", "color"),
  t(["color", "accent", "fg"], "#041018", "color"),
  t(["color", "signal"], "#8fd44f", "color"),
  t(["color", "success"], "#8fd44f", "color"),
  t(["color", "danger"], "#fb7185", "color"),
  t(["color", "danger", "fg"], "#1a080c", "color"),
  t(["color", "focus"], "#22d3ee", "color"),
  t(["color", "selection"], "rgba(34, 211, 238, 0.26)", "color"),
  t(["color", "soft", "bg"], "#0f2830", "color"),
  t(["color", "soft", "bgHover"], "#133540", "color"),
  t(["color", "soft", "fg"], "#a5f3fc", "color"),
  t(["color", "soft", "border"], "rgba(34, 211, 238, 0.42)", "color"),
  t(["color", "glass", "bg"], "rgba(10, 16, 28, 0.80)", "color"),
  t(["color", "glass", "border"], "rgba(34, 211, 238, 0.18)", "color"),
  t(["color", "glow"], "rgba(56, 189, 248, 0.14)", "color"),
  t(["color", "glow", "2"], "rgba(105, 190, 40, 0.08)", "color"),
  t(["color", "glow", "holo"], "rgba(34, 211, 238, 0.12)", "color"),
  t(["color", "overlay", "scrim"], "rgba(0, 0, 0, 0.72)", "color"),
  shadow(["shadow", "xs"], {
    color: "rgba(0, 0, 0, 0.4)",
    type: "dropShadow",
    x: 0,
    y: 1,
    blur: 1,
    spread: 0,
  }),
  shadow(
    ["shadow", "sm"],
    [
      {
        color: "rgba(0, 0, 0, 0.35)",
        type: "dropShadow",
        x: 0,
        y: 1,
        blur: 2,
        spread: 0,
      },
      {
        color: "rgba(0, 0, 0, 0.28)",
        type: "dropShadow",
        x: 0,
        y: 2,
        blur: 8,
        spread: 0,
      },
    ],
  ),
  shadow(
    ["shadow", "md"],
    [
      {
        color: "rgba(0, 0, 0, 0.3)",
        type: "dropShadow",
        x: 0,
        y: 2,
        blur: 4,
        spread: 0,
      },
      {
        color: "rgba(0, 0, 0, 0.4)",
        type: "dropShadow",
        x: 0,
        y: 10,
        blur: 28,
        spread: 0,
      },
    ],
  ),
  shadow(
    ["shadow", "lg"],
    [
      {
        color: "rgba(0, 0, 0, 0.3)",
        type: "dropShadow",
        x: 0,
        y: 4,
        blur: 8,
        spread: 0,
      },
      {
        color: "rgba(0, 0, 0, 0.48)",
        type: "dropShadow",
        x: 0,
        y: 18,
        blur: 44,
        spread: 0,
      },
    ],
  ),
];

function mergeByPath(...lists: FlatToken[][]): FlatToken[] {
  const map = new Map<string, FlatToken>();
  for (const list of lists) {
    for (const tok of list) {
      map.set(tok.path.join("."), tok);
    }
  }
  return [...map.values()];
}

export function tokensForTheme(theme: ThemeId): FlatToken[] {
  switch (theme) {
    case "instrument/light":
      return mergeByPath(foundation, instrumentPrimitives, instrumentLightSemantic);
    case "instrument/dark":
      return mergeByPath(foundation, instrumentPrimitives, instrumentDarkSemantic);
    case "dual/light":
      return mergeByPath(foundation, dualPrimitives, dualLightSemantic);
    case "dual/dark":
      return mergeByPath(foundation, dualPrimitives, dualDarkSemantic);
  }
}

export const THEME_IDS: ThemeId[] = [
  "instrument/light",
  "instrument/dark",
  "dual/light",
  "dual/dark",
];
