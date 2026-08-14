import { effect } from "@power-ux/core";
import { component, mergeProps, type ComponentProps } from "@power-ux/dom";
import { cx } from "../utils.js";
import { attachOverlay } from "../overlay.js";
import { readBool, type MaybeReactive } from "../reactive.js";

export type PopoverProps = {
  /** Controlled open state (boolean, signal, or accessor) */
  open: MaybeReactive<boolean>;
  onOpenChange?: (open: boolean) => void;
  /** Trigger content (usually a Button) */
  trigger: unknown;
  /** Panel body */
  children?: unknown;
  /** Preferred alignment under the trigger */
  align?: "start" | "center" | "end";
  class?: MaybeReactive<string>;
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
  transform: translateY(6px) scale(0.98);
  transform-origin: top center;
  transition:
    opacity var(--pu-duration) var(--pu-ease-out),
    transform var(--pu-duration) var(--pu-ease-out),
    visibility var(--pu-duration) var(--pu-ease-out);
}
.pu-popover__panel[data-side="top"] {
  transform: translateY(-6px) scale(0.98);
  transform-origin: bottom center;
}
.pu-popover--open .pu-popover__panel {
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
  transform: translateY(0) scale(1);
}
@media (prefers-reduced-motion: reduce) {
  .pu-popover__panel { transition: none; transform: none; }
  .pu-popover--open .pu-popover__panel { transform: none; }
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

/**
 * Anchored floating panel. Control with `open` + `onOpenChange`.
 * Escape + outside dismiss via shared `attachOverlay` (stacked with modals).
 */
export const Popover = component((raw: PopoverProps) => {
  ensureStyles();
  const props = mergeProps({ align: "start" as const }, raw) as ComponentProps<
    PopoverProps & { align: "start" | "center" | "end" }
  >;

  const isOpen = () => readBool(props.open as MaybeReactive<boolean>);

  let rootEl: HTMLElement | null = null;
  let panelEl: HTMLElement | null = null;
  let triggerEl: HTMLElement | null = null;

  const placePanel = () => {
    if (!rootEl || !panelEl || !triggerEl || !isOpen()) return;
    const doc = rootEl.ownerDocument;
    const win = doc.defaultView ?? window;
    const gap = 8;
    const pad = 8;
    const rect = triggerEl.getBoundingClientRect();
    const vw = win.innerWidth;
    const vh = win.innerHeight;

    panelEl.style.maxHeight = "";
    const naturalH = panelEl.scrollHeight || panelEl.offsetHeight || 160;
    const pw = Math.min(
      panelEl.offsetWidth || 192,
      Math.max(pad * 2, vw - pad * 2),
    );

    const spaceBelow = vh - rect.bottom - gap - pad;
    const spaceAbove = rect.top - gap - pad;
    const placeAbove =
      spaceBelow < Math.min(naturalH, 120) && spaceAbove > spaceBelow;

    const available = Math.max(96, placeAbove ? spaceAbove : spaceBelow);
    const maxH = Math.min(naturalH, available, vh * 0.7);
    panelEl.style.maxHeight = `${Math.round(maxH)}px`;

    const ph = Math.min(panelEl.offsetHeight || maxH, maxH);

    let top: number;
    if (placeAbove) {
      top = rect.top - gap - ph;
      panelEl.dataset.side = "top";
    } else {
      top = rect.bottom + gap;
      panelEl.dataset.side = "bottom";
    }
    top = Math.min(Math.max(pad, top), Math.max(pad, vh - ph - pad));

    let left = rect.left;
    if (props.align === "center") {
      left = rect.left + rect.width / 2 - pw / 2;
    } else if (props.align === "end") {
      left = rect.right - pw;
    }
    left = Math.min(Math.max(pad, left), Math.max(pad, vw - pw - pad));

    panelEl.style.top = `${Math.round(top)}px`;
    panelEl.style.left = `${Math.round(left)}px`;
    panelEl.style.width = "max-content";
    panelEl.style.minWidth = `${Math.min(pw, Math.max(rect.width, 10.5 * 16))}px`;
  };

  effect(() => {
    if (!isOpen()) return;
    return attachOverlay({
      getRoot: () => rootEl,
      onClose: () => props.onOpenChange?.(false),
      escape: true,
      dismissOutside: true,
      onAttach: ({ doc, win }) => {
        ensureStyles(doc);
        const onReposition = () => placePanel();
        const placeTimer = win.setTimeout(() => {
          placePanel();
          win.setTimeout(placePanel, 16);
        }, 0);
        win.addEventListener("resize", onReposition);
        doc.addEventListener("scroll", onReposition, true);
        win.addEventListener("scroll", onReposition, true);
        return () => {
          win.clearTimeout(placeTimer);
          win.removeEventListener("resize", onReposition);
          doc.removeEventListener("scroll", onReposition, true);
          win.removeEventListener("scroll", onReposition, true);
        };
      },
    });
  });

  return (
    <div
      class={() =>
        cx(
          "pu-popover",
          isOpen() && "pu-popover--open",
          typeof props.class === "function"
            ? (props.class as () => string)()
            : props.class,
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
