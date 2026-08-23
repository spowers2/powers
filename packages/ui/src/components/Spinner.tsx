import { component, mergeProps, type ComponentProps } from "@lab206/dom";
import { cx } from "../utils.js";

export type SpinnerSize = "sm" | "md" | "lg";

export type SpinnerProps = {
  size?: SpinnerSize;
  label?: string;
  class?: string | (() => string);
};

const styles = `
.pu-spinner {
  display: inline-flex;
  align-items: center;
  gap: var(--pu-space-2);
  color: var(--pu-color-accent);
  font-size: var(--pu-text-sm);
}
.pu-spinner__disk {
  border-radius: 50%;
  border-style: solid;
  border-color: color-mix(in srgb, currentColor 25%, transparent);
  border-top-color: currentColor;
  animation: pu-spin 0.7s linear infinite;
}
.pu-spinner--sm .pu-spinner__disk { width: 1rem; height: 1rem; border-width: 2px; }
.pu-spinner--md .pu-spinner__disk { width: 1.35rem; height: 1.35rem; border-width: 2.5px; }
.pu-spinner--lg .pu-spinner__disk { width: 1.75rem; height: 1.75rem; border-width: 3px; }
@keyframes pu-spin {
  to { transform: rotate(360deg); }
}
@media (prefers-reduced-motion: reduce) {
  .pu-spinner__disk { animation: none; border-top-color: currentColor; opacity: 0.7; }
}
`;

let injected = false;
function ensureStyles() {
  if (injected || typeof document === "undefined") return;
  injected = true;
  const el = document.createElement("style");
  el.setAttribute("data-pu-ui", "spinner");
  el.textContent = styles;
  document.head.appendChild(el);
}

export const Spinner = component((raw: SpinnerProps) => {
  ensureStyles();
  const props = mergeProps(
    { size: "md" as SpinnerSize, label: "Loading" },
    raw,
  ) as ComponentProps<SpinnerProps & { size: SpinnerSize; label: string }>;

  return (
    <span
      class={() =>
        cx(
          "pu-spinner",
          `pu-spinner--${props.size}`,
          typeof props.class === "function" ? props.class() : props.class,
        )
      }
      role="status"
    >
      <span class="pu-spinner__disk" aria-hidden="true" />
      <span class="pu-sr-only">{props.label}</span>
    </span>
  );
});
