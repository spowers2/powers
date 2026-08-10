import { effect } from "@power-ui/core";
import { component, mergeProps, type ComponentProps } from "@power-ui/dom";
import { cx } from "../utils.js";

export type SelectOption = { value: string; label: string; disabled?: boolean };

export type SelectProps = {
  value?: string | (() => string);
  options: SelectOption[] | (() => SelectOption[]);
  disabled?: boolean | (() => boolean);
  class?: string | (() => string);
  onChange?: (e: Event) => void;
  id?: string;
  "aria-label"?: string;
};

const styles = `
.pu-select {
  width: 100%;
  height: var(--pu-control-h-md);
  padding: 0 calc(var(--pu-control-px) + 1rem) 0 var(--pu-control-px);
  border-radius: var(--pu-radius-md);
  border: 1px solid var(--pu-color-border);
  background-color: var(--pu-color-surface);
  color: var(--pu-color-text);
  appearance: none;
  background-image: linear-gradient(45deg, transparent 50%, var(--pu-color-text-muted) 50%),
    linear-gradient(135deg, var(--pu-color-text-muted) 50%, transparent 50%);
  background-position: calc(100% - 14px) calc(50% - 3px), calc(100% - 9px) calc(50% - 3px);
  background-size: 5px 5px, 5px 5px;
  background-repeat: no-repeat;
  transition: border-color var(--pu-duration) var(--pu-ease), box-shadow var(--pu-duration) var(--pu-ease);
}
.pu-select:hover:not(:disabled) {
  border-color: color-mix(in srgb, var(--pu-color-border) 60%, var(--pu-color-text-muted));
}
.pu-select:focus {
  outline: none;
  border-color: var(--pu-color-accent);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--pu-color-accent) 25%, transparent);
}
.pu-select:disabled { opacity: 0.55; cursor: not-allowed; }
`;

let injected = false;
function ensureStyles() {
  if (injected || typeof document === "undefined") return;
  injected = true;
  const el = document.createElement("style");
  el.setAttribute("data-pu-ui", "select");
  el.textContent = styles;
  document.head.appendChild(el);
}

export const Select = component((raw: SelectProps) => {
  ensureStyles();
  const props = mergeProps({}, raw) as ComponentProps<SelectProps>;

  const selectEl = document.createElement("select");
  if (props.id) selectEl.id = props.id;
  if (props["aria-label"]) selectEl.setAttribute("aria-label", props["aria-label"]);
  if (props.onChange) selectEl.addEventListener("change", props.onChange);

  effect(() => {
    selectEl.className = cx(
      "pu-select",
      typeof props.class === "function" ? props.class() : props.class,
    );
    selectEl.disabled = !!(
      typeof props.disabled === "function" ? props.disabled() : props.disabled
    );

    const list =
      typeof props.options === "function" ? props.options() : props.options;
    const current =
      typeof props.value === "function" ? props.value() : props.value;

    selectEl.innerHTML = "";
    for (const opt of list ?? []) {
      const o = document.createElement("option");
      o.value = opt.value;
      o.textContent = opt.label;
      if (opt.disabled) o.disabled = true;
      selectEl.appendChild(o);
    }
    if (current !== undefined) selectEl.value = current;
  });

  return selectEl;
});
