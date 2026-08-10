import { component, mergeProps, type ComponentProps } from "@power-ui/dom";
import { cx } from "../utils.js";

export type TextProps = {
  as?: "p" | "span" | "h1" | "h2" | "h3" | "h4" | "label";
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  muted?: boolean | (() => boolean);
  weight?: "normal" | "medium" | "semibold" | "bold";
  class?: string | (() => string);
  children?: unknown;
};

const styles = `
.pu-text { margin: 0; color: var(--pu-color-text); line-height: var(--pu-leading); }
.pu-text--muted { color: var(--pu-color-text-muted); }
.pu-text--xs { font-size: var(--pu-text-xs); }
.pu-text--sm { font-size: var(--pu-text-sm); }
.pu-text--md { font-size: var(--pu-text-md); }
.pu-text--lg { font-size: var(--pu-text-lg); }
.pu-text--xl { font-size: var(--pu-text-xl); font-weight: var(--pu-font-semibold); letter-spacing: var(--pu-tracking-tight); line-height: var(--pu-leading-tight); }
.pu-text--2xl { font-size: var(--pu-text-2xl); font-weight: var(--pu-font-bold); letter-spacing: var(--pu-tracking-display); line-height: var(--pu-leading-tight); }
.pu-text--medium { font-weight: var(--pu-font-medium); }
.pu-text--semibold { font-weight: var(--pu-font-semibold); }
.pu-text--bold { font-weight: var(--pu-font-bold); }
`;

let injected = false;
function ensureStyles() {
  if (injected || typeof document === "undefined") return;
  injected = true;
  const el = document.createElement("style");
  el.setAttribute("data-pu-ui", "text");
  el.textContent = styles;
  document.head.appendChild(el);
}

export const Text = component((raw: TextProps) => {
  ensureStyles();
  const props = mergeProps(
    { as: "p" as const, size: "md" as const, weight: "normal" as const, muted: false },
    raw,
  ) as ComponentProps<Required<Pick<TextProps, "as" | "size" | "weight">> & TextProps>;

  const tag = props.as;
  const className = () =>
    cx(
      "pu-text",
      `pu-text--${props.size}`,
      props.weight !== "normal" && `pu-text--${props.weight}`,
      (typeof props.muted === "function" ? props.muted() : props.muted) &&
        "pu-text--muted",
      typeof props.class === "function" ? props.class() : props.class,
    );

  // Dynamic tag via h would be cleaner; jsx needs static tag — use span wrapper for rare tags via attribute
  if (tag === "h1")
    return <h1 class={className}>{props.children as never}</h1>;
  if (tag === "h2")
    return <h2 class={className}>{props.children as never}</h2>;
  if (tag === "h3")
    return <h3 class={className}>{props.children as never}</h3>;
  if (tag === "h4")
    return <h4 class={className}>{props.children as never}</h4>;
  if (tag === "span")
    return <span class={className}>{props.children as never}</span>;
  if (tag === "label")
    return <label class={className}>{props.children as never}</label>;
  return <p class={className}>{props.children as never}</p>;
});
