import { component, mergeProps, type ComponentProps } from "@power-ui/dom";
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
  position: absolute;
  left: 50%;
  z-index: var(--pu-z-toast);
  padding: 0.35rem 0.55rem;
  border-radius: var(--pu-radius-sm);
  background: var(--pu-gray-900);
  color: var(--pu-gray-50);
  font-size: var(--pu-text-xs);
  font-weight: var(--pu-font-medium);
  line-height: 1.35;
  letter-spacing: -0.01em;
  white-space: nowrap;
  max-width: min(16rem, 70vw);
  white-space: normal;
  pointer-events: none;
  opacity: 0;
  transform: translateX(-50%) translateY(2px);
  transition:
    opacity var(--pu-duration-fast) var(--pu-ease),
    transform var(--pu-duration-fast) var(--pu-ease);
  box-shadow: var(--pu-shadow-md);
  border: 1px solid color-mix(in srgb, var(--pu-gray-700) 80%, transparent);
}
[data-pu-theme="dark"] .pu-tooltip__bubble {
  background: var(--pu-gray-800);
  border-color: var(--pu-gray-700);
}
.pu-tooltip__bubble--top {
  bottom: calc(100% + 6px);
}
.pu-tooltip__bubble--bottom {
  top: calc(100% + 6px);
}
.pu-tooltip:hover .pu-tooltip__bubble,
.pu-tooltip:focus-within .pu-tooltip__bubble {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}
@media (prefers-reduced-motion: reduce) {
  .pu-tooltip__bubble { transition: none; }
}
`;

let injected = false;
function ensureStyles() {
  if (injected || typeof document === "undefined") return;
  injected = true;
  const el = document.createElement("style");
  el.setAttribute("data-pu-ui", "tooltip");
  el.textContent = styles;
  document.head.appendChild(el);
}

/**
 * Lightweight hover/focus tooltip. Wrap a single control as children.
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

  return (
    <span
      class={() =>
        cx(
          "pu-tooltip",
          typeof props.class === "function" ? props.class() : props.class,
        )
      }
    >
      <span class="pu-tooltip__trigger">{props.children as never}</span>
      <span
        class={() =>
          cx("pu-tooltip__bubble", `pu-tooltip__bubble--${props.side}`)
        }
        role="tooltip"
      >
        {text}
      </span>
    </span>
  );
});
