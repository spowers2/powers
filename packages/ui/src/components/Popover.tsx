import { effect } from "@power-ui/core";
import { component, mergeProps, type ComponentProps } from "@power-ui/dom";
import { cx } from "../utils.js";

export type PopoverProps = {
  /** Controlled open state (boolean, signal, or accessor) */
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
  max-width: 100%;
}
.pu-popover--open {
  z-index: var(--pu-z-overlay);
}
.pu-popover__trigger {
  display: inline-flex;
  max-width: 100%;
  cursor: pointer;
}
.pu-popover__panel {
  position: fixed;
  z-index: var(--pu-z-overlay);
  min-width: 12rem;
  max-width: min(20rem, calc(100vw - 1.5rem));
  max-height: min(70vh, 24rem);
  overflow: auto;
  padding: var(--pu-space-3);
  border-radius: var(--pu-radius-lg);
  background: var(--pu-color-surface-elevated);
  color: var(--pu-color-text);
  border: 1px solid var(--pu-color-border);
  box-shadow: var(--pu-shadow-float);
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transform: translateY(4px);
  transition:
    opacity var(--pu-duration-fast) var(--pu-ease),
    transform var(--pu-duration-fast) var(--pu-ease),
    visibility var(--pu-duration-fast) var(--pu-ease);
}
.pu-popover--open .pu-popover__panel {
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
  transform: translateY(0);
}
@media (prefers-reduced-motion: reduce) {
  .pu-popover__panel { transition: none; }
}
`;

function ensureStyles(doc: Document = document) {
  if (typeof doc === "undefined") return;
  if (doc.querySelector('style[data-pu-ui="popover"]')) return;
  const el = doc.createElement("style");
  el.setAttribute("data-pu-ui", "popover");
  el.textContent = styles;
  doc.head.appendChild(el);
}

function readOpen(open: unknown): boolean {
  if (typeof open === "function") return !!(open as () => boolean)();
  return !!open;
}

/**
 * Anchored floating panel. Control with `open` + `onOpenChange`.
 * Closes on Escape and outside pointer. Uses the element's ownerDocument
 * so Lab iframes work (not just the parent window).
 */
export const Popover = component((raw: PopoverProps) => {
  ensureStyles();
  const props = mergeProps({ align: "start" as const }, raw) as ComponentProps<
    PopoverProps & { align: "start" | "center" | "end" }
  >;

  const isOpen = () => readOpen(props.open);

  let rootEl: HTMLElement | null = null;
  let panelEl: HTMLElement | null = null;
  let triggerEl: HTMLElement | null = null;

  const placePanel = () => {
    if (!rootEl || !panelEl || !triggerEl || !isOpen()) return;
    const doc = rootEl.ownerDocument;
    const win = doc.defaultView ?? window;
    const gap = 6;
    const rect = triggerEl.getBoundingClientRect();
    // Measure after visible — if still zero-size, wait a frame
    const pw = panelEl.offsetWidth || 192;
    const ph = panelEl.offsetHeight || 80;
    const vw = win.innerWidth;
    const vh = win.innerHeight;

    let top = rect.bottom + gap;
    if (top + ph > vh - 8 && rect.top > ph + gap) {
      top = rect.top - ph - gap;
    }

    let left = rect.left;
    if (props.align === "center") {
      left = rect.left + rect.width / 2 - pw / 2;
    } else if (props.align === "end") {
      left = rect.right - pw;
    }
    left = Math.min(Math.max(8, left), Math.max(8, vw - pw - 8));
    top = Math.max(8, top);

    panelEl.style.top = `${Math.round(top)}px`;
    panelEl.style.left = `${Math.round(left)}px`;
  };

  // Dismiss + position while open.
  // Defer attach so refs from this render are set (open may start true).
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

      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          e.preventDefault();
          e.stopPropagation();
          props.onOpenChange?.(false);
        }
      };

      win.addEventListener("keydown", onKey, true);
      cleanups.push(() => win.removeEventListener("keydown", onKey, true));

      if (root) {
        const onPointer = (e: Event) => {
          const t = e.target as Node | null;
          if (!t) return;
          if (root.contains(t)) return;
          props.onOpenChange?.(false);
        };
        // Skip the opening interaction
        const timer = win.setTimeout(() => {
          if (disposed) return;
          doc.addEventListener("pointerdown", onPointer, true);
        }, 0);
        cleanups.push(() => {
          win.clearTimeout(timer);
          doc.removeEventListener("pointerdown", onPointer, true);
        });

        const onReposition = () => placePanel();
        // Prefer setTimeout over rAF — happy-dom / tests may never flush rAF
        const placeTimer = win.setTimeout(() => placePanel(), 0);
        cleanups.push(() => win.clearTimeout(placeTimer));
        win.addEventListener("resize", onReposition);
        doc.addEventListener("scroll", onReposition, true);
        cleanups.push(() => {
          win.removeEventListener("resize", onReposition);
          doc.removeEventListener("scroll", onReposition, true);
        });
      }
    };

    // Refs run during element creation; setup effects run before return.
    // Always defer so rootEl/triggerEl/panelEl exist.
    const win = typeof window !== "undefined" ? window : null;
    const timer = win?.setTimeout(attach, 0);
    if (timer != null) {
      cleanups.push(() => win!.clearTimeout(timer));
    } else {
      attach();
    }

    return () => {
      disposed = true;
      for (const c of cleanups) c();
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
        ensureStyles(el.ownerDocument);
      }}
    >
      <div
        class="pu-popover__trigger"
        ref={(el) => {
          triggerEl = el;
        }}
        onClick={(e: MouseEvent) => {
          e.stopPropagation();
          props.onOpenChange?.(!isOpen());
        }}
      >
        {props.trigger as never}
      </div>
      <div
        class="pu-popover__panel"
        role="dialog"
        aria-modal="false"
        aria-hidden={() => (!isOpen() ? "true" : "false")}
        ref={(el) => {
          panelEl = el;
        }}
      >
        {props.children as never}
      </div>
    </div>
  );
});
