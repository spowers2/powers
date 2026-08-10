import { effect } from "@power-ui/core";
import { component, mergeProps, type ComponentProps } from "@power-ui/dom";
import { cx } from "../utils.js";

export type DialogProps = {
  /** Controlled open state (boolean or accessor) */
  open: boolean | (() => boolean);
  onClose?: () => void;
  title?: string;
  description?: string;
  /** Panel size */
  size?: "sm" | "md" | "lg";
  class?: string | (() => string);
  children?: unknown;
};

const styles = `
.pu-dialog-root {
  position: fixed;
  inset: 0;
  z-index: var(--pu-z-overlay);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--pu-space-4);
  pointer-events: none;
  opacity: 0;
  visibility: hidden;
  transition:
    opacity var(--pu-duration) var(--pu-ease-out),
    visibility var(--pu-duration) var(--pu-ease-out);
}
.pu-dialog-root--open {
  pointer-events: auto;
  opacity: 1;
  visibility: visible;
}
.pu-dialog-backdrop {
  position: absolute;
  inset: 0;
  background: var(--pu-overlay-scrim);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
}
.pu-dialog-panel {
  position: relative;
  width: 100%;
  max-height: min(88vh, 720px);
  overflow: auto;
  background: var(--pu-color-surface-elevated);
  border: 1px solid var(--pu-color-border);
  border-radius: var(--pu-radius-xl);
  box-shadow: var(--pu-shadow-float);
  padding: var(--pu-space-6);
  transform: translateY(8px) scale(0.98);
  transition: transform var(--pu-duration-slow) var(--pu-ease-out);
}
.pu-dialog-root--open .pu-dialog-panel {
  transform: translateY(0) scale(1);
}
.pu-dialog-panel--sm { max-width: 22rem; }
.pu-dialog-panel--md { max-width: 28rem; }
.pu-dialog-panel--lg { max-width: 36rem; }
.pu-dialog__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--pu-space-3);
  margin-bottom: var(--pu-space-4);
}
.pu-dialog__title {
  margin: 0;
  font-size: var(--pu-text-xl);
  font-weight: var(--pu-font-bold);
  letter-spacing: var(--pu-tracking-tight);
  line-height: var(--pu-leading-tight);
}
.pu-dialog__desc {
  margin: var(--pu-space-2) 0 0;
  color: var(--pu-color-text-muted);
  font-size: var(--pu-text-sm);
  line-height: 1.5;
}
.pu-dialog__close {
  flex-shrink: 0;
  width: 2rem;
  height: 2rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid transparent;
  border-radius: var(--pu-radius-md);
  background: transparent;
  color: var(--pu-color-text-muted);
  cursor: pointer;
  font-size: 1.15rem;
  line-height: 1;
  transition:
    background var(--pu-duration) var(--pu-ease),
    color var(--pu-duration) var(--pu-ease);
}
.pu-dialog__close:hover {
  background: var(--pu-color-surface-2);
  color: var(--pu-color-text);
}
.pu-dialog__body {
  font-size: var(--pu-text-sm);
  line-height: 1.55;
}
`;

let injected = false;
function ensureStyles() {
  if (injected || typeof document === "undefined") return;
  injected = true;
  const el = document.createElement("style");
  el.setAttribute("data-pu-ui", "dialog");
  el.textContent = styles;
  document.head.appendChild(el);
}

/**
 * Modal dialog with glass scrim. Control via `open` + `onClose`.
 * Escape and backdrop click call `onClose`.
 */
export const Dialog = component((raw: DialogProps) => {
  ensureStyles();
  const props = mergeProps({ size: "md" as const }, raw) as ComponentProps<
    DialogProps & { size: "sm" | "md" | "lg" }
  >;

  const isOpen = () =>
    typeof props.open === "function" ? !!(props.open as () => boolean)() : !!props.open;

  // Escape key + body scroll lock while open
  effect(() => {
    if (!isOpen()) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") props.onClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  });

  return (
    <div
      class={() =>
        cx(
          "pu-dialog-root",
          isOpen() && "pu-dialog-root--open",
          typeof props.class === "function" ? props.class() : props.class,
        )
      }
      aria-hidden={() => (!isOpen() ? "true" : "false")}
    >
      <div
        class="pu-dialog-backdrop"
        onClick={() => props.onClose?.()}
        aria-hidden="true"
      />
      <div
        class={() => cx("pu-dialog-panel", `pu-dialog-panel--${props.size}`)}
        role="dialog"
        aria-modal="true"
        aria-labelledby={props.title ? "pu-dialog-title" : undefined}
      >
        {(props.title || props.onClose) && (
          <div class="pu-dialog__head">
            <div>
              {props.title ? (
                <h2 class="pu-dialog__title" id="pu-dialog-title">
                  {props.title}
                </h2>
              ) : null}
              {props.description ? (
                <p class="pu-dialog__desc">{props.description}</p>
              ) : null}
            </div>
            {props.onClose ? (
              <button
                type="button"
                class="pu-dialog__close"
                aria-label="Close"
                onClick={() => props.onClose?.()}
              >
                ×
              </button>
            ) : null}
          </div>
        )}
        <div class="pu-dialog__body">{props.children as never}</div>
      </div>
    </div>
  );
});
