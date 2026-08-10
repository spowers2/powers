import { component, mergeProps, type ComponentProps } from "@power-ui/dom";
import { cx } from "../utils.js";

export type ButtonVariant = "solid" | "soft" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export type ButtonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  type?: "button" | "submit" | "reset";
  disabled?: boolean | (() => boolean);
  class?: string | (() => string);
  onClick?: (e: MouseEvent) => void;
  children?: unknown;
  /** Accessible label when children are not text */
  "aria-label"?: string;
};

const styles = `
.pu-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--pu-space-2);
  border: 1px solid transparent;
  border-radius: var(--pu-radius-md);
  font-weight: var(--pu-font-semibold);
  letter-spacing: -0.01em;
  cursor: pointer;
  transition:
    background var(--pu-duration) var(--pu-ease),
    border-color var(--pu-duration) var(--pu-ease),
    color var(--pu-duration) var(--pu-ease),
    box-shadow var(--pu-duration) var(--pu-ease),
    transform var(--pu-duration-fast) var(--pu-ease);
  user-select: none;
}
.pu-btn:active:not(:disabled) { transform: translateY(1px); }
.pu-btn:disabled { opacity: 0.55; cursor: not-allowed; }

.pu-btn--sm { height: var(--pu-control-h-sm); padding: 0 var(--pu-space-3); font-size: var(--pu-text-sm); }
.pu-btn--md { height: var(--pu-control-h-md); padding: 0 var(--pu-control-px); font-size: var(--pu-text-sm); }
.pu-btn--lg { height: var(--pu-control-h-lg); padding: 0 var(--pu-space-5); font-size: var(--pu-text-md); }

.pu-btn--solid {
  background: var(--pu-color-accent);
  color: var(--pu-color-accent-fg);
  box-shadow:
    var(--pu-shadow-xs),
    inset 0 1px 0 color-mix(in srgb, #fff 12%, transparent);
}
.pu-btn--solid:hover:not(:disabled) {
  background: var(--pu-color-accent-hover);
  box-shadow: var(--pu-shadow-sm);
}

.pu-btn--soft {
  background: color-mix(in srgb, var(--pu-color-accent) 12%, transparent);
  color: var(--pu-color-accent);
  border-color: color-mix(in srgb, var(--pu-color-accent) 14%, transparent);
}
.pu-btn--soft:hover:not(:disabled) {
  background: color-mix(in srgb, var(--pu-color-accent) 20%, transparent);
}

.pu-btn--ghost {
  background: transparent;
  color: var(--pu-color-text);
  border-color: var(--pu-color-border);
}
.pu-btn--ghost:hover:not(:disabled) {
  background: var(--pu-color-surface-2);
  border-color: var(--pu-color-border-strong);
}

.pu-btn--danger {
  background: var(--pu-color-danger);
  color: var(--pu-color-danger-fg);
  box-shadow: var(--pu-shadow-xs);
}
.pu-btn--danger:hover:not(:disabled) { filter: brightness(1.06); }
`;

let injected = false;
function ensureStyles() {
  if (injected || typeof document === "undefined") return;
  injected = true;
  const el = document.createElement("style");
  el.setAttribute("data-pu-ui", "button");
  el.textContent = styles;
  document.head.appendChild(el);
}

/**
 * Primary action control. Tokens drive color/size — edit `tokens.css` to retheme.
 */
export const Button = component((raw: ButtonProps) => {
  ensureStyles();
  const props = mergeProps(
    { variant: "solid" as ButtonVariant, size: "md" as ButtonSize, type: "button" as const },
    raw,
  ) as ComponentProps<Required<Pick<ButtonProps, "variant" | "size" | "type">> & ButtonProps>;

  return (
    <button
      type={props.type}
      class={() =>
        cx(
          "pu-btn",
          `pu-btn--${props.variant}`,
          `pu-btn--${props.size}`,
          typeof props.class === "function" ? props.class() : props.class,
        )
      }
      disabled={
        typeof props.disabled === "function"
          ? props.disabled()
          : props.disabled
      }
      onClick={props.onClick}
      aria-label={props["aria-label"]}
    >
      {props.children as never}
    </button>
  );
});
