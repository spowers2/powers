import { component, mergeProps, type ComponentProps } from "@lab206/dom";
import { cx } from "../utils.js";
import { createStyleSheet } from "../styles.js";

export type SliderProps = {
  value?: number | (() => number);
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean | (() => boolean);
  onChange?: (value: number) => void;
  label?: string;
  showValue?: boolean;
  class?: string | (() => string);
  id?: string;
};

const ensure = createStyleSheet(
  "slider",
  `
.pu-slider {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  width: 100%;
  min-width: 8rem;
}
.pu-slider__head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 0.5rem;
  font-size: var(--pu-text-sm);
}
.pu-slider__label {
  color: var(--pu-color-text);
  font-weight: var(--pu-font-medium);
}
.pu-slider__value {
  color: var(--pu-color-text-muted);
  font-variant-numeric: tabular-nums;
  font-family: var(--pu-font-mono);
  font-size: var(--pu-text-xs);
}
.pu-slider__track {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 0.4rem;
  border-radius: var(--pu-radius-full);
  background: linear-gradient(
    to right,
    var(--pu-color-accent) 0%,
    var(--pu-color-accent) var(--pu-slider-pct, 0%),
    var(--pu-color-surface-sunken) var(--pu-slider-pct, 0%),
    var(--pu-color-surface-sunken) 100%
  );
  border: 1px solid var(--pu-color-control-border, var(--pu-color-border));
  outline: none;
  cursor: pointer;
}
.pu-slider__track:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.pu-slider__track:focus-visible {
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--pu-color-focus) 22%, transparent);
}
.pu-slider__track::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 1.1rem;
  height: 1.1rem;
  border-radius: 50%;
  background: var(--pu-color-accent);
  border: 2px solid var(--pu-color-accent-fg);
  box-shadow: var(--pu-shadow-sm);
  cursor: pointer;
  transition: transform var(--pu-duration-fast) var(--pu-ease-out);
}
.pu-slider__track:hover:not(:disabled)::-webkit-slider-thumb {
  transform: scale(1.08);
}
.pu-slider__track:focus-visible::-webkit-slider-thumb {
  box-shadow:
    var(--pu-shadow-sm),
    0 0 0 3px color-mix(in srgb, var(--pu-color-focus) 40%, transparent);
}
.pu-slider__track::-moz-range-thumb {
  width: 1.1rem;
  height: 1.1rem;
  border-radius: 50%;
  background: var(--pu-color-accent);
  border: 2px solid var(--pu-color-accent-fg);
  box-shadow: var(--pu-shadow-sm);
  cursor: pointer;
}
.pu-slider__track:focus-visible::-moz-range-thumb {
  box-shadow:
    var(--pu-shadow-sm),
    0 0 0 3px color-mix(in srgb, var(--pu-color-focus) 40%, transparent);
}
@media (prefers-reduced-motion: reduce) {
  .pu-slider__track::-webkit-slider-thumb { transition: none; }
  .pu-slider__track:hover:not(:disabled)::-webkit-slider-thumb { transform: none; }
}
`,
);

/** Range slider with fill track. */
export const Slider = component((raw: SliderProps) => {
  ensure();
  const props = mergeProps(
    { min: 0, max: 100, step: 1, showValue: true },
    raw,
  ) as ComponentProps<
    SliderProps & { min: number; max: number; step: number; showValue: boolean }
  >;
  const id = props.id ?? `pu-slider-${Math.random().toString(36).slice(2, 9)}`;

  const val = () => {
    const v =
      typeof props.value === "function"
        ? (props.value as () => number)()
        : (props.value ?? props.min);
    return Math.min(props.max, Math.max(props.min, Number(v)));
  };
  const isDisabled = () =>
    !!(typeof props.disabled === "function" ? props.disabled() : props.disabled);
  const pct = () => {
    const span = props.max - props.min || 1;
    return ((val() - props.min) / span) * 100;
  };

  return (
    <div
      class={() =>
        cx(
          "pu-slider",
          typeof props.class === "function" ? props.class() : props.class,
        )
      }
      ref={(el) => ensure(el.ownerDocument)}
    >
      {(props.label || props.showValue) && (
        <div class="pu-slider__head">
          {props.label ? (
            <label class="pu-slider__label" for={id}>
              {props.label}
            </label>
          ) : (
            <span />
          )}
          {props.showValue ? (
            <span class="pu-slider__value">{() => String(val())}</span>
          ) : null}
        </div>
      )}
      <input
        id={id}
        class="pu-slider__track"
        type="range"
        min={props.min}
        max={props.max}
        step={props.step}
        value={val}
        disabled={isDisabled}
        style={() => ({ "--pu-slider-pct": `${pct()}%` })}
        onInput={(e: Event) => {
          props.onChange?.(Number((e.target as HTMLInputElement).value));
        }}
      />
    </div>
  );
});
