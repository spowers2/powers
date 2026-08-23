import { component, mergeProps, type ComponentProps } from "@lab206/dom";
import { cx } from "../utils.js";

export type ProgressProps = {
  /** 0–100 */
  value?: number | (() => number);
  /** Accessible label */
  label?: string;
  size?: "sm" | "md";
  class?: string | (() => string);
};

const styles = `
.pu-progress {
  display: flex;
  flex-direction: column;
  gap: var(--pu-space-2);
  width: 100%;
  min-width: 0;
}
.pu-progress__meta {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: var(--pu-space-3);
  font-size: var(--pu-text-xs);
  color: var(--pu-color-text-muted);
  font-weight: var(--pu-font-medium);
}
.pu-progress__track {
  width: 100%;
  overflow: hidden;
  border-radius: var(--pu-radius-full);
  background: var(--pu-color-surface-sunken);
  border: 1px solid var(--pu-color-border);
}
.pu-progress--sm .pu-progress__track { height: 0.4rem; }
.pu-progress--md .pu-progress__track { height: 0.55rem; }
.pu-progress__bar {
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(
    90deg,
    var(--pu-brand-500),
    var(--pu-sage-400)
  );
  transition: width var(--pu-duration-slow) var(--pu-ease-out);
  box-shadow: inset 0 1px 0 color-mix(in srgb, #fff 10%, transparent);
}
`;

let injected = false;
function ensureStyles() {
  if (injected || typeof document === "undefined") return;
  injected = true;
  const el = document.createElement("style");
  el.setAttribute("data-pu-ui", "progress");
  el.textContent = styles;
  document.head.appendChild(el);
}

export const Progress = component((raw: ProgressProps) => {
  ensureStyles();
  const props = mergeProps(
    { value: 0, size: "md" as const },
    raw,
  ) as ComponentProps<ProgressProps & { value: number | (() => number); size: "sm" | "md" }>;

  const pct = () => {
    const v =
      typeof props.value === "function"
        ? (props.value as () => number)()
        : (props.value as number);
    return Math.max(0, Math.min(100, Number.isFinite(v) ? v : 0));
  };

  return (
    <div
      class={() =>
        cx(
          "pu-progress",
          `pu-progress--${props.size}`,
          typeof props.class === "function" ? props.class() : props.class,
        )
      }
    >
      {props.label ? (
        <div class="pu-progress__meta">
          <span>{props.label}</span>
          <span>{() => `${Math.round(pct())}%`}</span>
        </div>
      ) : null}
      <div
        class="pu-progress__track"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={() => Math.round(pct())}
        aria-label={props.label}
      >
        <div
          class="pu-progress__bar"
          style={() => ({ width: `${pct()}%` })}
        />
      </div>
    </div>
  );
});
