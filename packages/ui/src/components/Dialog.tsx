import { effect } from "@power-ui/core";
import { component, mergeProps, type ComponentProps } from "@power-ui/dom";
import { cx } from "../utils.js";

export type DialogProps = {
  /** Controlled open state (boolean, signal, or accessor) */
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
  color: var(--pu-color-text);
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
  color: var(--pu-color-text);
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
  color: var(--pu-color-text);
}
@media (prefers-reduced-motion: reduce) {
  .pu-dialog-root,
  .pu-dialog-panel { transition: none; }
}
`;

let injected = false;
function ensureStyles(doc: Document = document) {
  if (typeof doc === "undefined") return;
  if (doc.querySelector('style[data-pu-ui="dialog"]')) return;
  const el = doc.createElement("style");
  el.setAttribute("data-pu-ui", "dialog");
  el.textContent = styles;
  doc.head.appendChild(el);
  if (doc === document) injected = true;
}

function readOpen(open: unknown): boolean {
  if (typeof open === "function") return !!(open as () => boolean)();
  return !!open;
}

/**
 * Modal dialog with scrim. Control via `open` + `onClose`.
 * Escape and backdrop click call `onClose` (ownerDocument-aware for iframes).
 */
export const Dialog = component((raw: DialogProps) => {
  ensureStyles();
  const props = mergeProps({ size: "md" as const }, raw) as ComponentProps<
    DialogProps & { size: "sm" | "md" | "lg" }
  >;

  const isOpen = () => readOpen(props.open);
  let rootEl: HTMLElement | null = null;

  effect(() => {
    if (!isOpen()) return;

    let disposed = false;
    const cleanups: Array<() => void> = [];

    const attach = () => {
      if (disposed) return;
      const root = rootEl;
      const doc = root?.ownerDocument ?? document;
      const win = doc.defaultView ?? window;
      ensureStyles(doc);

      const body = doc.body;
      const prev = body.style.overflow;
      body.style.overflow = "hidden";
      cleanups.push(() => {
        body.style.overflow = prev;
      });

      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          e.preventDefault();
          e.stopPropagation();
          props.onClose?.();
        }
      };
      win.addEventListener("keydown", onKey, true);
      cleanups.push(() => win.removeEventListener("keydown", onKey, true));
    };

    // Defer so ref is set when open starts true on first paint
    const timer = window.setTimeout(attach, 0);
    cleanups.push(() => window.clearTimeout(timer));

    return () => {
      disposed = true;
      for (const c of cleanups) c();
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
      ref={(el) => {
        rootEl = el;
        ensureStyles(el.ownerDocument);
      }}
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
        onClick={(e: MouseEvent) => e.stopPropagation()}
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
