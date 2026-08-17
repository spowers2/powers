import { component, mergeProps, type ComponentProps } from "@powers/dom";
import { cx } from "../utils.js";

export type BadgeTone = "neutral" | "accent" | "success" | "warning";

export type BadgeProps = {
  tone?: BadgeTone | (() => BadgeTone);
  class?: string | (() => string);
  children?: unknown;
};

const styles = `
.pu-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--pu-space-1);
  padding: 0.2em 0.65em;
  border-radius: var(--pu-radius-full);
  font-size: var(--pu-text-xs);
  font-weight: var(--pu-font-semibold);
  letter-spacing: 0.02em;
  line-height: 1.4;
  border: 1px solid transparent;
  white-space: nowrap;
}
.pu-badge--neutral {
  background: var(--pu-color-surface-2);
  color: var(--pu-color-text);
  border-color: var(--pu-color-border-strong, var(--pu-color-border));
}
.pu-badge--accent {
  background: var(--pu-color-soft-bg);
  color: var(--pu-color-soft-fg);
  border-color: var(--pu-color-soft-border);
}
.pu-badge--success {
  background: color-mix(in srgb, var(--pu-color-success, var(--pu-sage-500)) 16%, var(--pu-color-surface));
  color: var(--pu-sage-800, #2a5410);
  border-color: color-mix(in srgb, var(--pu-color-success, var(--pu-sage-500)) 36%, var(--pu-color-border));
}
.pu-badge--warning {
  background: color-mix(in srgb, var(--pu-color-warning, #a67c3d) 16%, var(--pu-color-surface));
  color: var(--pu-color-warning-fg, #5c4018);
  border-color: color-mix(in srgb, var(--pu-color-warning, #a67c3d) 32%, var(--pu-color-border));
}
[data-pu-theme="dark"] .pu-badge--success {
  color: var(--pu-sage-300, #8fd44f);
  background: color-mix(in srgb, var(--pu-sage-400) 18%, var(--pu-color-surface));
}
[data-pu-theme="dark"] .pu-badge--warning {
  color: #f0c14d;
  background: color-mix(in srgb, #e0b45c 16%, var(--pu-color-surface));
}
`;

let injected = false;
function ensureStyles() {
  if (injected || typeof document === "undefined") return;
  injected = true;
  const el = document.createElement("style");
  el.setAttribute("data-pu-ui", "badge");
  el.textContent = styles;
  document.head.appendChild(el);
}

export const Badge = component((raw: BadgeProps) => {
  ensureStyles();
  const props = mergeProps({ tone: "neutral" as const }, raw) as ComponentProps<
    BadgeProps & { tone: NonNullable<BadgeProps["tone"]> }
  >;
  return (
    <span
      class={() =>
        cx(
          "pu-badge",
          `pu-badge--${props.tone}`,
          typeof props.class === "function" ? props.class() : props.class,
        )
      }
    >
      {props.children as never}
    </span>
  );
});
