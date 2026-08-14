import { type Signal } from "@powers/core";
import { component, mergeProps, type ComponentProps } from "@powers/dom";
import { cx } from "../utils.js";
import { readBool, type MaybeReactive } from "../reactive.js";
import type { Bindable } from "../form.js";

export type SwitchProps = {
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
.pu-switch {
  display: inline-flex;
  align-items: center;
  gap: var(--pu-space-2);
  cursor: pointer;
  user-select: none;
  font-size: var(--pu-text-sm);
  color: var(--pu-color-text);
}
.pu-switch[data-disabled="true"] {
  opacity: 0.55;
  cursor: not-allowed;
}
.pu-switch__track {
  position: relative;
  width: 2.5rem;
  height: 1.4rem;
  border-radius: var(--pu-radius-full);
  background: var(--pu-color-border);
  transition: background var(--pu-duration) var(--pu-ease-out);
  flex-shrink: 0;
}
.pu-switch[data-checked="true"] .pu-switch__track {
  background: var(--pu-color-accent);
}
.pu-switch__thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  width: calc(1.4rem - 4px);
  height: calc(1.4rem - 4px);
  border-radius: 50%;
  background: #fff;
  box-shadow: var(--pu-shadow-sm);
  transition: transform var(--pu-duration) var(--pu-ease-spring);
}
.pu-switch[data-checked="true"] .pu-switch__thumb {
  transform: translateX(1.1rem);
}
@media (prefers-reduced-motion: reduce) {
  .pu-switch__thumb,
  .pu-switch__track { transition: none; }
}
.pu-switch__input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}
.pu-switch__input:focus-visible + .pu-switch__track {
  outline: none;
  box-shadow:
    0 0 0 2px var(--pu-color-surface),
    0 0 0 4px color-mix(in srgb, var(--pu-color-focus) 55%, transparent);
}
`;

let injected = false;
function ensureStyles() {
  if (injected || typeof document === "undefined") return;
  injected = true;
  const el = document.createElement("style");
  el.setAttribute("data-pu-ui", "switch");
  el.textContent = styles;
  document.head.appendChild(el);
}

export const Switch = component((raw: SwitchProps) => {
  ensureStyles();
  const props = mergeProps({}, raw) as ComponentProps<SwitchProps>;
  const id = props.id ?? `pu-switch-${Math.random().toString(36).slice(2, 9)}`;
  const bound = raw.bind;

  const isChecked = () =>
    bound
      ? readBool(bound as MaybeReactive<boolean>)
      : readBool(props.checked as MaybeReactive<boolean>);
  const isDisabled = () => readBool(props.disabled as MaybeReactive<boolean>);

  return (
    <label
      class={() =>
        cx(
          "pu-switch",
          typeof props.class === "function" ? props.class() : props.class,
        )
      }
      data-checked={() => (isChecked() ? "true" : "false")}
      data-disabled={() => (isDisabled() ? "true" : "false")}
    >
      <input
        id={id}
        class="pu-switch__input"
        type="checkbox"
        role="switch"
        checked={isChecked}
        disabled={isDisabled}
        onChange={(e: Event) => {
          if (isDisabled()) return;
          const next = (e.target as HTMLInputElement).checked;
          if (bound) bound.set(next);
          props.onChange?.(next);
        }}
      />
      <span class="pu-switch__track" aria-hidden="true">
        <span class="pu-switch__thumb" />
      </span>
      {props.label ? <span>{props.label}</span> : null}
    </label>
  );
});
