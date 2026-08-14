import { type Signal } from "@power-ux/core";
import { component, mergeProps, type ComponentProps } from "@power-ux/dom";
import { cx } from "../utils.js";
import { readBool, type MaybeReactive } from "../reactive.js";
import type { Bindable } from "../form.js";

export type CheckboxProps = {
  checked?: MaybeReactive<boolean>;
  /** Two-way bind a boolean signal. */
  bind?: Bindable<boolean> | Signal<boolean>;
  disabled?: MaybeReactive<boolean>;
  onChange?: (checked: boolean) => void;
  label?: string;
  class?: MaybeReactive<string>;
  id?: string;
};

const styles = `
.pu-checkbox {
  display: inline-flex;
  align-items: center;
  gap: var(--pu-space-2);
  cursor: pointer;
  user-select: none;
  font-size: var(--pu-text-sm);
  color: var(--pu-color-text);
}
.pu-checkbox[data-disabled="true"] {
  opacity: 0.55;
  cursor: not-allowed;
}
.pu-checkbox__box {
  width: 1.1rem;
  height: 1.1rem;
  border-radius: 5px;
  border: 1.5px solid var(--pu-color-border);
  background: var(--pu-color-surface);
  display: grid;
  place-items: center;
  transition:
    background var(--pu-duration) var(--pu-ease-out),
    border-color var(--pu-duration) var(--pu-ease-out),
    transform var(--pu-duration-fast) var(--pu-ease-spring);
  flex-shrink: 0;
}
.pu-checkbox[data-checked="true"] .pu-checkbox__box {
  background: var(--pu-color-accent);
  border-color: var(--pu-color-accent);
  transform: scale(1.05);
}
.pu-checkbox__box svg {
  width: 0.7rem;
  height: 0.7rem;
  opacity: 0;
  color: var(--pu-color-accent-fg);
  transform: scale(0.5);
  transition:
    opacity var(--pu-duration-fast) var(--pu-ease-out),
    transform var(--pu-duration) var(--pu-ease-spring);
}
.pu-checkbox[data-checked="true"] .pu-checkbox__box svg {
  opacity: 1;
  transform: scale(1);
}
.pu-checkbox__input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}
`;

let injected = false;
function ensureStyles() {
  if (injected || typeof document === "undefined") return;
  injected = true;
  const el = document.createElement("style");
  el.setAttribute("data-pu-ui", "checkbox");
  el.textContent = styles;
  document.head.appendChild(el);
}

export const Checkbox = component((raw: CheckboxProps) => {
  ensureStyles();
  const props = mergeProps({}, raw) as ComponentProps<CheckboxProps>;
  const id = props.id ?? `pu-check-${Math.random().toString(36).slice(2, 9)}`;
  const bound = raw.bind;

  const isChecked = () =>
    bound
      ? readBool(bound as MaybeReactive<boolean>)
      : readBool(props.checked as MaybeReactive<boolean>);
  const isDisabled = () => readBool(props.disabled as MaybeReactive<boolean>);

  const box = document.createElement("span");
  box.className = "pu-checkbox__box";
  box.setAttribute("aria-hidden", "true");
  box.innerHTML =
    '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M3.5 8.5 L6.5 11.5 L12.5 4.5"/></svg>';

  return (
    <label
      class={() =>
        cx(
          "pu-checkbox",
          typeof props.class === "function" ? props.class() : props.class,
        )
      }
      data-checked={() => (isChecked() ? "true" : "false")}
      data-disabled={() => (isDisabled() ? "true" : "false")}
    >
      <input
        id={id}
        class="pu-checkbox__input"
        type="checkbox"
        checked={isChecked}
        disabled={isDisabled}
        onChange={(e: Event) => {
          if (isDisabled()) return;
          const next = (e.target as HTMLInputElement).checked;
          if (bound) bound.set(next);
          props.onChange?.(next);
        }}
      />
      {box}
      {props.label ? <span>{props.label}</span> : null}
    </label>
  );
});
