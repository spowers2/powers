import { effect } from "@lab206/core";
import { component, mergeProps, type ComponentProps } from "@lab206/dom";
import { cx, puId } from "../utils.js";
import { createStyleSheet } from "../styles.js";
import { attachOverlay } from "../overlay.js";
import { readBool, type MaybeReactive } from "../reactive.js";

export type DrawerProps = {
  open: MaybeReactive<boolean>;
  onClose?: () => void;
  title?: string;
  side?: "left" | "right";
  class?: MaybeReactive<string>;
  children?: unknown;
};

const ensure = createStyleSheet(
  "drawer",
  `
.pu-drawer-root {
  position: fixed;
  inset: 0;
  z-index: var(--pu-z-overlay);
  pointer-events: none;
  opacity: 0;
  visibility: hidden;
  transition: opacity var(--pu-duration) var(--pu-ease-out),
    visibility var(--pu-duration) var(--pu-ease-out);
}
.pu-drawer-root--open {
  pointer-events: auto;
  opacity: 1;
  visibility: visible;
}
.pu-drawer-backdrop {
  position: absolute;
  inset: 0;
  background: var(--pu-overlay-scrim);
  backdrop-filter: blur(4px);
}
.pu-drawer-panel {
  position: absolute;
  top: 0;
  bottom: 0;
  width: min(22rem, 92vw);
  background: var(--pu-color-surface-elevated);
  color: var(--pu-color-text);
  border: 0 solid var(--pu-color-border);
  box-shadow: var(--pu-shadow-float);
  display: flex;
  flex-direction: column;
  transition: transform var(--pu-duration-slow) var(--pu-ease-out);
}
.pu-drawer-panel--right {
  right: 0;
  border-left-width: 1px;
  transform: translateX(100%);
}
.pu-drawer-panel--left {
  left: 0;
  border-right-width: 1px;
  transform: translateX(-100%);
}
.pu-drawer-root--open .pu-drawer-panel { transform: translateX(0); }
.pu-drawer__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: var(--pu-space-4);
  border-bottom: 1px solid var(--pu-color-border);
}
.pu-drawer__title {
  margin: 0;
  font-size: var(--pu-text-lg);
  font-weight: var(--pu-font-bold);
  letter-spacing: var(--pu-tracking-tight);
}
.pu-drawer__close {
  appearance: none;
  border: 0;
  background: transparent;
  color: var(--pu-color-text-muted);
  font-size: 1.2rem;
  cursor: pointer;
  width: 2rem;
  height: 2rem;
  border-radius: var(--pu-radius-md);
}
.pu-drawer__close:hover {
  background: var(--pu-color-surface-2);
  color: var(--pu-color-text);
}
.pu-drawer__close:focus-visible {
  outline: none;
  color: var(--pu-color-text);
  box-shadow:
    0 0 0 2px var(--pu-color-surface-elevated),
    0 0 0 4px color-mix(in srgb, var(--pu-color-focus) 55%, transparent);
}
.pu-drawer__body {
  padding: var(--pu-space-4);
  overflow: auto;
  flex: 1;
  font-size: var(--pu-text-sm);
  line-height: 1.55;
}
@media (prefers-reduced-motion: reduce) {
  .pu-drawer-root, .pu-drawer-panel { transition: none; }
}
`,
);

/** Slide-over panel. Esc + backdrop + focus trap via shared `attachOverlay`. */
export const Drawer = component((raw: DrawerProps) => {
  ensure();
  const props = mergeProps({ side: "right" as const }, raw) as ComponentProps<
    DrawerProps & { side: "left" | "right" }
  >;
  const isOpen = () => readBool(props.open as MaybeReactive<boolean>);
  let rootEl: HTMLElement | null = null;
  let panelEl: HTMLElement | null = null;

  const titleId = puId("pu-drawer-title");

  effect(() => {
    if (!isOpen()) return;
    return attachOverlay({
      getRoot: () => rootEl,
      getFocusRoot: () => panelEl,
      onClose: () => props.onClose?.(),
      scrollLock: true,
      escape: true,
      onAttach: ({ doc }) => {
        ensure(doc);
      },
    });
  });

  return (
    <div
      class={() =>
        cx(
          "pu-drawer-root",
          isOpen() && "pu-drawer-root--open",
          typeof props.class === "function"
            ? (props.class as () => string)()
            : props.class,
        )
      }
      aria-hidden={() => (!isOpen() ? "true" : "false")}
      ref={(el) => {
        rootEl = el;
        ensure(el.ownerDocument);
      }}
    >
      <div
        class="pu-drawer-backdrop"
        onClick={() => props.onClose?.()}
        aria-hidden="true"
      />
      <div
        class={() => cx("pu-drawer-panel", `pu-drawer-panel--${props.side}`)}
        role="dialog"
        aria-modal="true"
        aria-labelledby={props.title ? titleId : undefined}
        ref={(el) => {
          panelEl = el;
        }}
      >
        {(props.title || props.onClose) && (
          <div class="pu-drawer__head">
            {props.title ? (
              <h2 class="pu-drawer__title" id={titleId}>
                {props.title}
              </h2>
            ) : (
              <span />
            )}
            {props.onClose ? (
              <button
                type="button"
                class="pu-drawer__close"
                aria-label="Close"
                onClick={() => props.onClose?.()}
              >
                ×
              </button>
            ) : null}
          </div>
        )}
        <div class="pu-drawer__body">{props.children as never}</div>
      </div>
    </div>
  );
});
