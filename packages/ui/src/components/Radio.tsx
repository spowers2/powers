import { For, component, mergeProps, type ComponentProps } from "@power-ux/dom";
import { cx } from "../utils.js";
import { createStyleSheet } from "../styles.js";

export type RadioOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

export type RadioGroupProps = {
  options: RadioOption[] | (() => RadioOption[]);
  value?: string | (() => string);
  name?: string;
  disabled?: boolean | (() => boolean);
  onChange?: (value: string) => void;
  orientation?: "vertical" | "horizontal";
  class?: string | (() => string);
};

const ensure = createStyleSheet(
  "radio",
  `
.pu-radio-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.pu-radio-group--horizontal {
  flex-direction: row;
  flex-wrap: wrap;
  gap: 0.75rem 1.25rem;
}
.pu-radio {
  display: inline-flex;
  align-items: center;
  gap: var(--pu-space-2);
  cursor: pointer;
  user-select: none;
  font-size: var(--pu-text-sm);
  color: var(--pu-color-text);
}
.pu-radio[data-disabled="true"] {
  opacity: 0.55;
  cursor: not-allowed;
}
.pu-radio__dot {
  width: 1.1rem;
  height: 1.1rem;
  border-radius: 50%;
  border: 1.5px solid var(--pu-color-border);
  background: var(--pu-color-surface);
  display: grid;
  place-items: center;
  flex-shrink: 0;
  transition:
    border-color var(--pu-duration) var(--pu-ease),
    background var(--pu-duration) var(--pu-ease);
}
.pu-radio[data-checked="true"] .pu-radio__dot {
  border-color: var(--pu-color-accent);
}
.pu-radio__dot::after {
  content: "";
  width: 0.45rem;
  height: 0.45rem;
  border-radius: 50%;
  background: var(--pu-color-accent);
  opacity: 0;
  transform: scale(0.5);
  transition:
    opacity var(--pu-duration) var(--pu-ease),
    transform var(--pu-duration) var(--pu-ease);
}
.pu-radio[data-checked="true"] .pu-radio__dot::after {
  opacity: 1;
  transform: scale(1);
}
.pu-radio__input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}
.pu-radio__input:focus-visible + .pu-radio__dot {
  outline: none;
  box-shadow:
    0 0 0 2px var(--pu-color-surface),
    0 0 0 4px color-mix(in srgb, var(--pu-color-focus) 55%, transparent);
}
@media (prefers-reduced-motion: reduce) {
  .pu-radio__dot,
  .pu-radio__dot::after { transition: none; }
}
`,
);

/** Radio group — single selection from options. */
export const RadioGroup = component((raw: RadioGroupProps) => {
  ensure();
  const props = mergeProps(
    { orientation: "vertical" as const },
    raw,
  ) as ComponentProps<RadioGroupProps & { orientation: "vertical" | "horizontal" }>;

  const name =
    props.name ?? `pu-radio-${Math.random().toString(36).slice(2, 9)}`;

  const current = () =>
    typeof props.value === "function"
      ? (props.value as () => string)()
      : (props.value ?? "");
  const groupDisabled = () =>
    !!(typeof props.disabled === "function" ? props.disabled() : props.disabled);

  const getOptions = () =>
    typeof props.options === "function"
      ? (props.options as () => RadioOption[])()
      : (props.options ?? []);

  return (
    <div
      class={() =>
        cx(
          "pu-radio-group",
          props.orientation === "horizontal" && "pu-radio-group--horizontal",
          typeof props.class === "function" ? props.class() : props.class,
        )
      }
      role="radiogroup"
      ref={(el) => ensure(el.ownerDocument)}
    >
      <For each={getOptions}>
        {(opt) => (
          <label
            class="pu-radio"
            data-checked={() => (current() === opt().value ? "true" : "false")}
            data-disabled={() =>
              groupDisabled() || opt().disabled ? "true" : "false"
            }
          >
            <input
              class="pu-radio__input"
              type="radio"
              name={name}
              value={() => opt().value}
              checked={() => current() === opt().value}
              disabled={() => groupDisabled() || !!opt().disabled}
              onChange={() => props.onChange?.(opt().value)}
            />
            <span class="pu-radio__dot" aria-hidden="true" />
            <span>{() => opt().label}</span>
          </label>
        )}
      </For>
    </div>
  );
});
