import { effect } from "@power-ui/core";
import { component, mergeProps, type ComponentProps } from "@power-ui/dom";
import { cx } from "../utils.js";

export type PopoverProps = {
  /** Controlled open state */
  open: boolean | (() => boolean);
  onOpenChange?: (open: boolean) => void;
  /** Trigger content (usually a Button) */
  trigger: unknown;
  /** Panel body */
  children?: unknown;
  /** Preferred alignment under the trigger */
  align?: "start" | "center" | "end";
  class?: string | (() => string);
};

const styles = `
.pu-popover {
  position: relative;
  display: inline-flex;
  vertical-align: middle;
}
.pu-popover__trigger {
  display: inline-flex;
}
.pu-popover__panel {
  position: absolute;
  top: calc(100% + 6px);
  z-index: var(--pu-z-overlay);
  min-width: 12rem;
  max-width: min(20rem, 90vw);
  padding: var(--pu-space-3);
  border-radius: var(--pu-radius-lg);
  background: var(--pu-color-surface-elevated);
  border: 1px solid var(--pu-color-border);
  box-shadow: var(--pu-shadow-float);
  opacity: 0;
  visibility: hidden;
  transform: translateY(4px);
  pointer-events: none;
  transition:
    opacity var(--pu-duration-fast) var(--pu-ease),
    transform var(--pu-duration-fast) var(--pu-ease),
    visibility var(--pu-duration-fast) var(--pu-ease);
}
.pu-popover--open .pu-popover__panel {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
  pointer-events: auto;
}
.pu-popover__panel--start { left: 0; }
.pu-popover__panel--center { left: 50%; transform: translateX(-50%) translateY(4px); }
.pu-popover--open .pu-popover__panel--center { transform: translateX(-50%) translateY(0); }
.pu-popover__panel--end { right: 0; left: auto; }
@media (prefers-reduced-motion: reduce) {
  .pu-popover__panel { transition: none; }
}
`;

let injected = false;
function ensureStyles() {
  if (injected || typeof document === "undefined") return;
  injected = true;
  const el = document.createElement("style");
  el.setAttribute("data-pu-ui", "popover");
  el.textContent = styles;
  document.head.appendChild(el);
}

/**
 * Lightweight anchored panel. Control with `open` + `onOpenChange`.
 * Closes on Escape and outside click while open.
 */
export const Popover = component((raw: PopoverProps) => {
  ensureStyles();
  const props = mergeProps({ align: "start" as const }, raw) as ComponentProps<
    PopoverProps & { align: "start" | "center" | "end" }
  >;

  const isOpen = () =>
    typeof props.open === "function"
      ? !!(props.open as () => boolean)()
      : !!props.open;

  let rootEl: HTMLElement | null = null;

  effect(() => {
    if (!isOpen()) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") props.onOpenChange?.(false);
    };
    const onDoc = (e: MouseEvent) => {
      const t = e.target as Node | null;
      if (rootEl && t && !rootEl.contains(t)) props.onOpenChange?.(false);
    };
    window.addEventListener("keydown", onKey);
    // next tick so the opening click doesn't immediately close
    const id = window.setTimeout(() => {
      document.addEventListener("mousedown", onDoc);
    }, 0);
    return () => {
      window.clearTimeout(id);
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDoc);
    };
  });

  return (
    <div
      class={() =>
        cx(
          "pu-popover",
          isOpen() && "pu-popover--open",
          typeof props.class === "function" ? props.class() : props.class,
        )
      }
      ref={(el) => {
        rootEl = el;
      }}
    >
      <div
        class="pu-popover__trigger"
        onClick={() => props.onOpenChange?.(!isOpen())}
      >
        {props.trigger as never}
      </div>
      <div
        class={() =>
          cx("pu-popover__panel", `pu-popover__panel--${props.align}`)
        }
        role="dialog"
        aria-hidden={() => (!isOpen() ? "true" : "false")}
      >
        {props.children as never}
      </div>
    </div>
  );
});
