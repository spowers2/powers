import { component, mergeProps, type ComponentProps } from "@power-ux/dom";
import { cx } from "../utils.js";
import { createStyleSheet } from "../styles.js";
import { readBool, readNum, type MaybeReactive } from "../reactive.js";

export type NumberInputProps = {
  value?: MaybeReactive<number>;
  min?: number;
  max?: number;
  step?: number;
  disabled?: MaybeReactive<boolean>;
  onChange?: (value: number) => void;
  placeholder?: string;
  class?: MaybeReactive<string>;
  id?: string;
  "aria-label"?: string;
};

const ensure = createStyleSheet(
  "number-input",
  `
.pu-number {
  display: inline-flex;
  align-items: stretch;
  border: 1px solid var(--pu-color-border);
  border-radius: var(--pu-radius-md);
  background: var(--pu-color-surface);
  overflow: hidden;
  height: var(--pu-control-h-md);
}
.pu-number:focus-within {
  border-color: var(--pu-color-accent);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--pu-color-accent) 18%, transparent);
}
.pu-number[data-disabled="true"] {
  opacity: 0.55;
  pointer-events: none;
}
.pu-number__btn {
  appearance: none;
  border: 0;
  background: var(--pu-color-surface-2);
  color: var(--pu-color-text);
  width: 2rem;
  cursor: pointer;
  font-size: 1rem;
  line-height: 1;
  flex-shrink: 0;
}
.pu-number__btn:hover:not(:disabled) {
  background: color-mix(in srgb, var(--pu-color-accent) 12%, var(--pu-color-surface-2));
}
.pu-number__btn:disabled { opacity: 0.4; cursor: not-allowed; }
.pu-number__input {
  appearance: textfield;
  -moz-appearance: textfield;
  border: 0;
  background: transparent;
  color: var(--pu-color-text);
  font: inherit;
  font-size: var(--pu-text-sm);
  font-variant-numeric: tabular-nums;
  text-align: center;
  width: 4rem;
  min-width: 0;
  padding: 0 0.25rem;
  outline: none;
}
.pu-number__input::-webkit-outer-spin-button,
.pu-number__input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
`,
);

function clamp(n: number, min?: number, max?: number) {
  let v = n;
  if (min != null && !Number.isNaN(min)) v = Math.max(min, v);
  if (max != null && !Number.isNaN(max)) v = Math.min(max, v);
  return v;
}

/** Numeric stepper with − / + controls. */
export const NumberInput = component((raw: NumberInputProps) => {
  ensure();
  const props = mergeProps({ step: 1 }, raw) as ComponentProps<
    NumberInputProps & { step: number }
  >;
  const id = props.id ?? `pu-num-${Math.random().toString(36).slice(2, 9)}`;

  const val = () => readNum(props.value as MaybeReactive<number>, 0);
  const isDisabled = () =>
    readBool(props.disabled as MaybeReactive<boolean>);

  const set = (n: number) => {
    const next = clamp(n, props.min, props.max);
    if (!Number.isNaN(next)) props.onChange?.(next);
  };

  return (
    <div
      class={() =>
        cx(
          "pu-number",
          typeof props.class === "function" ? props.class() : props.class,
        )
      }
      data-disabled={() => (isDisabled() ? "true" : "false")}
      ref={(el) => ensure(el.ownerDocument)}
    >
      <button
        type="button"
        class="pu-number__btn"
        aria-label="Decrease"
        disabled={() =>
          isDisabled() || (props.min != null && val() <= props.min)
        }
        onClick={() => set(val() - props.step)}
      >
        −
      </button>
      <input
        id={id}
        class="pu-number__input"
        type="number"
        value={val}
        min={props.min}
        max={props.max}
        step={props.step}
        disabled={isDisabled}
        placeholder={props.placeholder}
        aria-label={props["aria-label"]}
        onInput={(e: Event) => {
          const n = Number((e.target as HTMLInputElement).value);
          if (!Number.isNaN(n)) set(n);
        }}
      />
      <button
        type="button"
        class="pu-number__btn"
        aria-label="Increase"
        disabled={() =>
          isDisabled() || (props.max != null && val() >= props.max)
        }
        onClick={() => set(val() + props.step)}
      >
        +
      </button>
    </div>
  );
});
