import { component, mergeProps, type ComponentProps } from "@power-ui/dom";
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
  color: var(--pu-color-text-muted);
  border-color: var(--pu-color-border);
}
.pu-badge--accent {
  background: color-mix(in srgb, var(--pu-color-accent) 16%, transparent);
  color: var(--pu-color-accent);
  border-color: color-mix(in srgb, var(--pu-color-accent) 28%, transparent);
}
.pu-badge--success {
  background: color-mix(in srgb, var(--pu-sage-500) 14%, transparent);
  color: var(--pu-sage-700);
  border-color: color-mix(in srgb, var(--pu-sage-500) 32%, transparent);
}
.pu-badge--warning {
  background: color-mix(in srgb, #a67c3d 14%, transparent);
  color: #7a5a28;
  border-color: color-mix(in srgb, #a67c3d 28%, transparent);
}
[data-pu-theme="dark"] .pu-badge--success { color: var(--pu-sage-300); }
[data-pu-theme="dark"] .pu-badge--warning { color: #c4a46a; }
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
