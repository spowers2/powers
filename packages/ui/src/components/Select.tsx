import { effect, type Signal } from "@power-ui/core";
import { component, mergeProps, type ComponentProps } from "@power-ui/dom";
import { cx } from "../utils.js";
import { readBool, readProp, type MaybeReactive } from "../reactive.js";
import type { Bindable } from "../form.js";

export type SelectOption = { value: string; label: string; disabled?: boolean };

export type SelectProps = {
  value?: MaybeReactive<string>;
  /** Two-way bind a string signal — preferred over value + onChange. */
  bind?: Bindable<string> | Signal<string>;
  options: MaybeReactive<SelectOption[]>;
  /** Shown as a disabled first option when value is empty (optional). */
  placeholder?: string;
  disabled?: MaybeReactive<boolean>;
  class?: MaybeReactive<string>;
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

/** Native select. Prefer `<Select bind={status} options={…} />`. */
export const Select = component((raw: SelectProps) => {
  ensureStyles();
  const props = mergeProps({}, raw) as ComponentProps<SelectProps>;
  const bound = raw.bind;

  const selectEl = document.createElement("select");
  if (props.id) selectEl.id = props.id;
  if (props["aria-label"]) selectEl.setAttribute("aria-label", props["aria-label"]);

  selectEl.addEventListener("change", (e) => {
    if (bound) {
      const t = (e.currentTarget ?? e.target) as HTMLSelectElement | null;
      if (t && "value" in t) bound.set(t.value);
    }
    props.onChange?.(e);
  });

  effect(() => {
    // mergeProps unwraps accessors on read; readProp stays defensive.
    selectEl.className = cx("pu-select", readProp(props.class as MaybeReactive<string>));
    selectEl.disabled = readBool(props.disabled as MaybeReactive<boolean>);

    const opts = readProp(props.options as MaybeReactive<SelectOption[]>) ?? [];
    const current = bound
      ? readProp(bound as MaybeReactive<string>)
      : readProp(props.value as MaybeReactive<string>);
    const prev = selectEl.value;
    const placeholder = raw.placeholder;

    selectEl.innerHTML = "";
    const values = new Set<string>();

    if (placeholder) {
      const ph = document.createElement("option");
      ph.value = "";
      ph.textContent = placeholder;
      ph.disabled = true;
      // Keep selectable only when nothing chosen yet so the label can show
      ph.hidden = !!(current && current !== "");
      selectEl.appendChild(ph);
      values.add("");
    }

    for (const opt of opts) {
      const o = document.createElement("option");
      o.value = opt.value;
      o.textContent = opt.label;
      if (opt.disabled) o.disabled = true;
      selectEl.appendChild(o);
      values.add(opt.value);
    }

    // Prefer controlled value when it exists in the list; else keep prev; else first option.
    // Avoid browser “blank select” when options shrink (reactive project/client filters).
    let next = "";
    if (current !== undefined && values.has(current)) {
      next = current;
    } else if (prev && values.has(prev)) {
      next = prev;
    } else if (opts[0]) {
      next = opts[0].value;
    }
    if (selectEl.value !== next) selectEl.value = next;
  });

  return selectEl;
});
