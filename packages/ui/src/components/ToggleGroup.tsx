import { For, component, mergeProps, type ComponentProps } from "@power-ux/dom";
import { cx } from "../utils.js";
import { createStyleSheet } from "../styles.js";

export type ToggleOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

export type ToggleGroupProps = {
  options: ToggleOption[] | (() => ToggleOption[]);
  /** Controlled value(s) — string for single, string[] for multi */
  value?: string | string[] | (() => string | string[]);
  /** Allow multiple selections */
  multiple?: boolean;
  onChange?: (value: string | string[]) => void;
  size?: "sm" | "md";
  class?: string | (() => string);
};

const ensure = createStyleSheet(
  "toggle-group",
  `
.pu-toggle-group {
  display: inline-flex;
  align-items: stretch;
  padding: 3px;
  gap: 2px;
  border-radius: var(--pu-radius-md);
  background: var(--pu-color-surface-sunken);
  border: 1px solid var(--pu-color-border);
  width: fit-content;
  max-width: 100%;
  flex-wrap: wrap;
}
.pu-toggle {
  appearance: none;
  border: 0;
  background: transparent;
  color: var(--pu-color-text-muted);
  font: inherit;
  font-weight: var(--pu-font-semibold);
  letter-spacing: -0.01em;
  border-radius: calc(var(--pu-radius-md) - 2px);
  cursor: pointer;
  white-space: nowrap;
  transition:
    background var(--pu-duration) var(--pu-ease-out),
    color var(--pu-duration) var(--pu-ease-out),
    box-shadow var(--pu-duration) var(--pu-ease-out),
    transform var(--pu-duration-fast) var(--pu-ease-out);
}
.pu-toggle--sm { padding: 0.3rem 0.65rem; font-size: var(--pu-text-xs); }
.pu-toggle--md { padding: 0.4rem 0.85rem; font-size: var(--pu-text-sm); }
.pu-toggle:hover:not(:disabled):not(.is-on) {
  color: var(--pu-color-text);
  background: color-mix(in srgb, var(--pu-color-surface) 70%, transparent);
}
.pu-toggle:active:not(:disabled) { transform: scale(0.96); }
.pu-toggle:focus-visible {
  outline: none;
  box-shadow:
    0 0 0 2px var(--pu-color-surface-sunken),
    0 0 0 4px color-mix(in srgb, var(--pu-color-focus) 55%, transparent);
  z-index: 1;
}
.pu-toggle.is-on {
  background: var(--pu-color-surface);
  color: var(--pu-color-text);
  box-shadow: var(--pu-shadow-xs);
}
.pu-toggle.is-on:focus-visible {
  box-shadow:
    var(--pu-shadow-xs),
    0 0 0 2px var(--pu-color-surface),
    0 0 0 4px color-mix(in srgb, var(--pu-color-focus) 55%, transparent);
}
.pu-toggle:disabled { opacity: 0.45; cursor: not-allowed; }
@media (prefers-reduced-motion: reduce) {
  .pu-toggle {
    transition: background var(--pu-duration-fast) linear, color var(--pu-duration-fast) linear;
  }
  .pu-toggle:active:not(:disabled) { transform: none; }
}
`,
);

/** Segmented control — single or multi select. */
export const ToggleGroup = component((raw: ToggleGroupProps) => {
  ensure();
  const props = mergeProps(
    { multiple: false, size: "md" as const },
    raw,
  ) as ComponentProps<
    ToggleGroupProps & { multiple: boolean; size: "sm" | "md" }
  >;

  const current = (): string | string[] => {
    if (props.value === undefined) return props.multiple ? [] : "";
    return typeof props.value === "function"
      ? (props.value as () => string | string[])()
      : props.value;
  };

  const isOn = (v: string) => {
    const c = current();
    return Array.isArray(c) ? c.includes(v) : c === v;
  };

  const toggle = (v: string) => {
    if (props.multiple) {
      const c = current();
      const arr = Array.isArray(c) ? [...c] : c ? [c] : [];
      const i = arr.indexOf(v);
      if (i >= 0) arr.splice(i, 1);
      else arr.push(v);
      props.onChange?.(arr);
    } else {
      props.onChange?.(v);
    }
  };

  const getOptions = () =>
    typeof props.options === "function"
      ? (props.options as () => ToggleOption[])()
      : (props.options ?? []);

  return (
    <div
      class={() =>
        cx(
          "pu-toggle-group",
          typeof props.class === "function" ? props.class() : props.class,
        )
      }
      role="group"
      ref={(el) => ensure(el.ownerDocument)}
    >
      <For each={getOptions}>
        {(opt) => (
          <button
            type="button"
            class={() =>
              cx(
                "pu-toggle",
                `pu-toggle--${props.size}`,
                isOn(opt().value) && "is-on",
              )
            }
            aria-pressed={() => isOn(opt().value)}
            disabled={() => !!opt().disabled}
            onClick={() => toggle(opt().value)}
          >
            {() => opt().label}
          </button>
        )}
      </For>
    </div>
  );
});
