import { component, mergeProps, type ComponentProps } from "@lab206/dom";
import { cx } from "../utils.js";
import { readBool, type MaybeReactive } from "../reactive.js";

export type ButtonVariant = "solid" | "soft" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export type ButtonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  type?: "button" | "submit" | "reset";
  disabled?: MaybeReactive<boolean>;
  class?: MaybeReactive<string>;
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
  letter-spacing: -0.015em;
  cursor: pointer;
  transition:
    background var(--pu-duration) var(--pu-ease-out),
    border-color var(--pu-duration) var(--pu-ease-out),
    color var(--pu-duration) var(--pu-ease-out),
    box-shadow var(--pu-duration) var(--pu-ease-out),
    transform var(--pu-duration-fast) var(--pu-ease-out),
    filter var(--pu-duration-fast) var(--pu-ease);
  user-select: none;
}
.pu-btn:hover:not(:disabled) { transform: translateY(-1px); }
.pu-btn:active:not(:disabled) { transform: translateY(1px) scale(0.99); }
.pu-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.pu-btn:focus-visible {
  outline: none;
  box-shadow:
    0 0 0 2px var(--pu-color-surface),
    0 0 0 4px color-mix(in srgb, var(--pu-color-focus) 55%, transparent);
}
@media (prefers-reduced-motion: reduce) {
  .pu-btn { transition: background var(--pu-duration-fast) linear, border-color var(--pu-duration-fast) linear; }
  .pu-btn:hover:not(:disabled),
  .pu-btn:active:not(:disabled) { transform: none; }
}

.pu-btn--sm { height: var(--pu-control-h-sm); padding: 0 var(--pu-space-3); font-size: var(--pu-text-sm); }
.pu-btn--md { height: var(--pu-control-h-md); padding: 0 var(--pu-control-px); font-size: var(--pu-text-sm); }
.pu-btn--lg { height: var(--pu-control-h-lg); padding: 0 var(--pu-space-5); font-size: var(--pu-text-md); }

.pu-btn--solid {
  background: linear-gradient(
    165deg,
    color-mix(in srgb, var(--pu-color-accent) 92%, #fff) 0%,
    var(--pu-color-accent) 48%,
    color-mix(in srgb, var(--pu-color-accent) 88%, #000) 100%
  );
  color: var(--pu-color-accent-fg);
  border-color: color-mix(in srgb, var(--pu-brass-500) 35%, var(--pu-color-accent));
  box-shadow:
    var(--pu-shadow-sm),
    inset 0 1px 0 color-mix(in srgb, #fff 14%, transparent);
}
.pu-btn--solid:hover:not(:disabled) {
  background: var(--pu-color-accent-hover);
  box-shadow: var(--pu-shadow-md);
}

.pu-btn--soft {
  background: var(--pu-color-soft-bg);
  color: var(--pu-color-soft-fg);
  border-color: var(--pu-color-soft-border);
  box-shadow: none;
}
.pu-btn--soft:hover:not(:disabled) {
  background: var(--pu-color-soft-bg-hover);
}

.pu-btn--ghost {
  background: transparent;
  color: var(--pu-color-text);
  border-color: var(--pu-color-control-border, var(--pu-color-border-strong));
  box-shadow: none;
}
.pu-btn--ghost:hover:not(:disabled) {
  background: var(--pu-color-surface-2);
  border-color: var(--pu-color-border-strong);
}

.pu-btn--danger {
  background: var(--pu-color-danger);
  color: var(--pu-color-danger-fg);
  box-shadow: var(--pu-shadow-sm);
}
.pu-btn--danger:hover:not(:disabled) { filter: brightness(1.05); }
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

  // Live accessor — createProps unwraps signals/() => on each read
  const getDisabled = () =>
    readBool(props.disabled as MaybeReactive<boolean>);

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
      disabled={getDisabled}
      onClick={props.onClick}
      aria-label={props["aria-label"]}
    >
      {props.children as never}
    </button>
  );
});
