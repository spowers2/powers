import { component, type ComponentProps } from "@power-ux/dom";
import { cx } from "../utils.js";
import { createStyleSheet } from "../styles.js";

export type StatProps = {
  label: string;
  value: string | number | (() => string | number);
  /** e.g. "+12%" or "vs last week" */
  delta?: string | (() => string);
  /** Visual tone for delta */
  tone?: "neutral" | "positive" | "negative";
  hint?: string | (() => string);
  /** When set, the card is a button that navigates / filters. */
  onClick?: () => void;
  class?: string | (() => string);
};

const ensure = createStyleSheet(
  "stat",
  `
.pu-stat {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 1rem 1.1rem;
  border: 1px solid var(--pu-color-border);
  border-radius: var(--pu-radius-lg);
  background: var(--pu-color-surface);
  min-width: 0;
  text-align: left;
  font: inherit;
  color: inherit;
}
button.pu-stat {
  appearance: none;
  cursor: pointer;
  width: 100%;
  transition:
    border-color var(--pu-duration) var(--pu-ease),
    box-shadow var(--pu-duration) var(--pu-ease),
    transform var(--pu-duration-fast) var(--pu-ease);
}
button.pu-stat:hover {
  border-color: color-mix(in srgb, var(--pu-color-accent) 40%, var(--pu-color-border));
  box-shadow: var(--pu-shadow-sm);
  transform: translateY(-1px);
}
button.pu-stat:focus-visible {
  outline: 2px solid var(--pu-color-accent);
  outline-offset: 2px;
}
.pu-stat__label {
  font-size: var(--pu-text-xs);
  font-weight: var(--pu-font-semibold);
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--pu-color-text-muted);
}
.pu-stat__value {
  font-size: var(--pu-text-2xl, 1.65rem);
  font-weight: var(--pu-font-bold);
  letter-spacing: var(--pu-tracking-tight);
  color: var(--pu-color-text);
  font-variant-numeric: tabular-nums;
  line-height: 1.15;
}
.pu-stat__row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}
.pu-stat__delta {
  font-size: var(--pu-text-xs);
  font-weight: var(--pu-font-semibold);
  padding: 0.1rem 0.4rem;
  border-radius: var(--pu-radius-full);
  background: var(--pu-color-surface-2);
  color: var(--pu-color-text-muted);
}
.pu-stat__delta--positive {
  background: color-mix(in srgb, var(--pu-color-success, #69be28) 18%, transparent);
  color: var(--pu-color-success, #69be28);
}
.pu-stat__delta--negative {
  background: color-mix(in srgb, var(--pu-color-danger) 16%, transparent);
  color: var(--pu-color-danger);
}
.pu-stat__hint {
  font-size: var(--pu-text-xs);
  color: var(--pu-color-text-muted);
}
`,
);

/** KPI / metric card for dashboards. */
export const Stat = component((raw: StatProps) => {
  ensure();
  const props = raw as ComponentProps<StatProps>;
  const value = () =>
    typeof props.value === "function"
      ? (props.value as () => string | number)()
      : props.value;
  const delta = () =>
    typeof props.delta === "function"
      ? (props.delta as () => string)()
      : props.delta;

  const hint = () =>
    typeof props.hint === "function"
      ? (props.hint as () => string)()
      : props.hint;

  const body = (
    <>
      <div class="pu-stat__label">{props.label}</div>
      <div class="pu-stat__value">{() => String(value())}</div>
      {(props.delta || props.hint) && (
        <div class="pu-stat__row">
          {() => {
            const d = delta();
            if (!d) return null;
            const s = document.createElement("span");
            s.className = cx(
              "pu-stat__delta",
              props.tone === "positive" && "pu-stat__delta--positive",
              props.tone === "negative" && "pu-stat__delta--negative",
            );
            s.textContent = d;
            return s;
          }}
          {() => {
            const h = hint();
            if (!h) return null;
            const s = document.createElement("span");
            s.className = "pu-stat__hint";
            s.textContent = h;
            return s;
          }}
        </div>
      )}
    </>
  );

  const cls = () =>
    cx(
      "pu-stat",
      typeof props.class === "function" ? props.class() : props.class,
    );

  if (props.onClick) {
    return (
      <button
        type="button"
        class={cls}
        onClick={() => props.onClick?.()}
        ref={(el) => ensure(el.ownerDocument)}
      >
        {body}
      </button>
    );
  }

  return (
    <div class={cls} ref={(el) => ensure(el.ownerDocument)}>
      {body}
    </div>
  );
});
