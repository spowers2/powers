import { component, mergeProps, type ComponentProps } from "@powers/dom";
import { cx } from "../utils.js";

export type TooltipProps = {
  /** Tooltip text */
  content: string | (() => string);
  /** Preferred side */
  side?: "top" | "bottom";
  class?: string | (() => string);
  children?: unknown;
};

const styles = `
.pu-tooltip {
  position: relative;
  display: inline-flex;
  max-width: 100%;
}
.pu-tooltip__trigger {
  display: inline-flex;
  max-width: 100%;
}
.pu-tooltip__bubble {
  position: fixed;
  z-index: var(--pu-z-toast);
  padding: 0.35rem 0.55rem;
  border-radius: var(--pu-radius-sm);
  background: var(--pu-gray-900);
  color: var(--pu-gray-50);
  font-size: var(--pu-text-xs);
  font-weight: var(--pu-font-medium);
  line-height: 1.35;
  letter-spacing: -0.01em;
  max-width: min(16rem, 70vw);
  white-space: normal;
  pointer-events: none;
  opacity: 0;
  visibility: hidden;
  transform: translateY(4px) scale(0.96);
  transition:
    opacity var(--pu-duration) var(--pu-ease-out),
    transform var(--pu-duration) var(--pu-ease-out),
    visibility var(--pu-duration) var(--pu-ease-out);
  box-shadow: var(--pu-shadow-md);
  border: 1px solid color-mix(in srgb, var(--pu-gray-700) 80%, transparent);
}
[data-pu-theme="dark"] .pu-tooltip__bubble {
  background: var(--pu-gray-800);
  border-color: var(--pu-gray-700);
}
.pu-tooltip__bubble.is-open {
  opacity: 1;
  visibility: visible;
  transform: translateY(0) scale(1);
}
@media (prefers-reduced-motion: reduce) {
  .pu-tooltip__bubble { transition: none; transform: none; }
  .pu-tooltip__bubble.is-open { transform: none; }
}
`;

let injected = false;
function ensureStyles(doc: Document = document) {
  if (typeof doc === "undefined") return;
  if (doc.querySelector('style[data-pu-ui="tooltip"]')) return;
  const el = doc.createElement("style");
  el.setAttribute("data-pu-ui", "tooltip");
  el.textContent = styles;
  doc.head.appendChild(el);
  if (doc === document) injected = true;
}

/**
 * Lightweight hover/focus tooltip.
 * Bubble is portaled to `document.body` so overflow:hidden ancestors cannot clip it.
 */
export const Tooltip = component((raw: TooltipProps) => {
  ensureStyles();
  const props = mergeProps({ side: "top" as const }, raw) as ComponentProps<
    TooltipProps & { side: "top" | "bottom" }
  >;

  const text = () =>
    typeof props.content === "function"
      ? (props.content as () => string)()
      : props.content;

  let rootEl: HTMLElement | null = null;
  let triggerEl: HTMLElement | null = null;
  let bubbleEl: HTMLElement | null = null;
  let portaled = false;

  const place = () => {
    if (!triggerEl || !bubbleEl) return;
    if (!bubbleEl.classList.contains("is-open")) return;
    const doc = triggerEl.ownerDocument;
    const win = doc.defaultView ?? window;
    const gap = 8;
    const pad = 8;
    const rect = triggerEl.getBoundingClientRect();
    const bw = bubbleEl.offsetWidth || 120;
    const bh = bubbleEl.offsetHeight || 28;
    const vw = win.innerWidth;
    const vh = win.innerHeight;

    const prefer = props.side;
    const spaceAbove = rect.top - gap - pad;
    const spaceBelow = vh - rect.bottom - gap - pad;
    let side: "top" | "bottom" = prefer;
    if (prefer === "top" && spaceAbove < bh && spaceBelow > spaceAbove) {
      side = "bottom";
    } else if (
      prefer === "bottom" &&
      spaceBelow < bh &&
      spaceAbove > spaceBelow
    ) {
      side = "top";
    }

    let top = side === "top" ? rect.top - gap - bh : rect.bottom + gap;
    top = Math.min(Math.max(pad, top), Math.max(pad, vh - bh - pad));

    let left = rect.left + rect.width / 2 - bw / 2;
    left = Math.min(Math.max(pad, left), Math.max(pad, vw - bw - pad));

    bubbleEl.dataset.side = side;
    bubbleEl.style.top = `${Math.round(top)}px`;
    bubbleEl.style.left = `${Math.round(left)}px`;
  };

  const ensurePortal = () => {
    if (!bubbleEl || portaled) return;
    const doc = bubbleEl.ownerDocument;
    ensureStyles(doc);
    doc.body.appendChild(bubbleEl);
    portaled = true;
  };

  const open = () => {
    ensurePortal();
    bubbleEl?.classList.add("is-open");
    rootEl?.classList.add("is-open");
    const win = triggerEl?.ownerDocument.defaultView ?? window;
    win.setTimeout(place, 0);
  };
  const close = () => {
    bubbleEl?.classList.remove("is-open");
    rootEl?.classList.remove("is-open");
  };

  return (
    <span
      class={() =>
        cx(
          "pu-tooltip",
          typeof props.class === "function" ? props.class() : props.class,
        )
      }
      ref={(el) => {
        rootEl = el;
        ensureStyles(el.ownerDocument);
      }}
      onMouseEnter={open}
      onMouseLeave={close}
      onFocusIn={open}
      onFocusOut={close}
    >
      <span
        class="pu-tooltip__trigger"
        ref={(el) => {
          triggerEl = el;
        }}
      >
        {props.children as never}
      </span>
      <span
        class="pu-tooltip__bubble"
        role="tooltip"
        ref={(el) => {
          bubbleEl = el;
        }}
      >
        {text}
      </span>
    </span>
  );
});
