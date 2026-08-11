import { signal, effect } from "@power-ui/core";
import { For, Show, component, mergeProps, type ComponentProps } from "@power-ui/dom";
import { cx } from "../utils.js";

export type ComboboxOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

export type ComboboxProps = {
  options: ComboboxOption[] | (() => ComboboxOption[]);
  value?: string | (() => string);
  placeholder?: string;
  disabled?: boolean | (() => boolean);
  /** Called with the selected option value */
  onChange?: (value: string) => void;
  /** Filter function — default: case-insensitive label includes query */
  filter?: (opt: ComboboxOption, query: string) => boolean;
  class?: string | (() => string);
  id?: string;
  "aria-label"?: string;
};

const styles = `
.pu-combobox {
  position: relative;
  width: 100%;
  min-width: 0;
}
.pu-combobox__input {
  width: 100%;
  height: var(--pu-control-h-md);
  padding: 0 var(--pu-control-px);
  border-radius: var(--pu-radius-md);
  border: 1px solid var(--pu-color-border);
  background: var(--pu-color-surface);
  color: var(--pu-color-text);
  box-shadow: var(--pu-shadow-xs);
  transition:
    border-color var(--pu-duration) var(--pu-ease),
    box-shadow var(--pu-duration) var(--pu-ease);
}
.pu-combobox__input::placeholder { color: var(--pu-color-text-muted); }
.pu-combobox__input:hover:not(:disabled) {
  border-color: color-mix(in srgb, var(--pu-color-border) 50%, var(--pu-color-text-muted));
}
.pu-combobox__input:focus {
  outline: none;
  border-color: color-mix(in srgb, var(--pu-color-accent) 55%, var(--pu-color-border));
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--pu-color-accent) 16%, transparent);
}
.pu-combobox__input:disabled { opacity: 0.55; cursor: not-allowed; }
.pu-combobox__list {
  position: absolute;
  left: 0;
  right: 0;
  top: calc(100% + 4px);
  z-index: var(--pu-z-overlay);
  margin: 0;
  padding: 0.25rem;
  list-style: none;
  max-height: 14rem;
  overflow: auto;
  border-radius: var(--pu-radius-lg);
  background: var(--pu-color-surface-elevated);
  border: 1px solid var(--pu-color-border);
  box-shadow: var(--pu-shadow-float);
  display: none;
}
.pu-combobox--open .pu-combobox__list { display: block; }
.pu-combobox__option {
  display: block;
  width: 100%;
  text-align: left;
  appearance: none;
  border: 0;
  background: transparent;
  font: inherit;
  font-size: var(--pu-text-sm);
  color: var(--pu-color-text);
  padding: 0.5rem 0.65rem;
  border-radius: var(--pu-radius-sm);
  cursor: pointer;
}
.pu-combobox__option:hover:not(:disabled),
.pu-combobox__option.is-active:not(:disabled) {
  background: var(--pu-color-surface-2);
}
.pu-combobox__option:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}
.pu-combobox__option.is-selected {
  color: var(--pu-color-accent);
  font-weight: var(--pu-font-semibold);
}
.pu-combobox__empty {
  padding: 0.65rem;
  font-size: var(--pu-text-sm);
  color: var(--pu-color-text-muted);
}
`;

function ensureStyles(doc: Document = document) {
  if (typeof doc === "undefined") return;
  if (doc.querySelector('style[data-pu-ui="combobox"]')) return;
  const el = doc.createElement("style");
  el.setAttribute("data-pu-ui", "combobox");
  el.textContent = styles;
  doc.head.appendChild(el);
}

const defaultFilter = (opt: ComboboxOption, q: string) =>
  opt.label.toLowerCase().includes(q.toLowerCase());

/**
 * Searchable select: type to filter, click or Enter to choose.
 */
export const Combobox = component((raw: ComboboxProps) => {
  ensureStyles();
  const props = mergeProps(
    { placeholder: "Search…" },
    raw,
  ) as ComponentProps<ComboboxProps & { placeholder: string }>;

  const open = signal(false);
  const query = signal("");
  const active = signal(0);
  let rootEl: HTMLElement | null = null;

  const getOptions = (): ComboboxOption[] => {
    const o = props.options;
    return typeof o === "function" ? (o as () => ComboboxOption[])() : (o ?? []);
  };

  const getValue = () =>
    typeof props.value === "function"
      ? (props.value as () => string)()
      : (props.value ?? "");

  const filtered = () => {
    const q = query().trim();
    const list = getOptions();
    const fn = props.filter ?? defaultFilter;
    if (!q) return list;
    return list.filter((opt) => fn(opt, q));
  };

  const selectedLabel = () => {
    const v = getValue();
    const hit = getOptions().find((o) => o.value === v);
    return hit?.label ?? "";
  };

  effect(() => {
    if (!open()) {
      query.set(selectedLabel());
    }
  });

  effect(() => {
    if (!open()) return;
    const root = rootEl;
    if (!root) return;
    const doc = root.ownerDocument;
    const win = doc.defaultView ?? window;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        open.set(false);
        query.set(selectedLabel());
      }
    };
    const onPtr = (e: Event) => {
      const t = e.target as Node | null;
      if (t && !root.contains(t)) {
        open.set(false);
        query.set(selectedLabel());
      }
    };
    win.addEventListener("keydown", onKey, true);
    const t = win.setTimeout(() => {
      doc.addEventListener("pointerdown", onPtr, true);
    }, 0);
    return () => {
      win.clearTimeout(t);
      win.removeEventListener("keydown", onKey, true);
      doc.removeEventListener("pointerdown", onPtr, true);
    };
  });

  const pick = (opt: ComboboxOption) => {
    if (opt.disabled) return;
    props.onChange?.(opt.value);
    query.set(opt.label);
    open.set(false);
  };

  return (
    <div
      class={() =>
        cx(
          "pu-combobox",
          open() && "pu-combobox--open",
          typeof props.class === "function" ? props.class() : props.class,
        )
      }
      ref={(el) => {
        rootEl = el;
        ensureStyles(el.ownerDocument);
      }}
    >
      <input
        type="text"
        class="pu-combobox__input"
        id={props.id}
        aria-label={props["aria-label"]}
        aria-expanded={() => (open() ? "true" : "false")}
        aria-autocomplete="list"
        role="combobox"
        placeholder={props.placeholder}
        disabled={
          typeof props.disabled === "function"
            ? props.disabled
            : props.disabled
        }
        value={query}
        onFocus={() => {
          open.set(true);
          active.set(0);
        }}
        onInput={(e: Event) => {
          const v = (e.target as HTMLInputElement).value;
          query.set(v);
          open.set(true);
          active.set(0);
        }}
        onKeyDown={(e: KeyboardEvent) => {
          const list = filtered();
          if (e.key === "ArrowDown") {
            e.preventDefault();
            open.set(true);
            active.set(Math.min(Math.max(list.length - 1, 0), active() + 1));
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            active.set(Math.max(0, active() - 1));
          } else if (e.key === "Enter") {
            e.preventDefault();
            const opt = list[active()];
            if (opt) pick(opt);
          }
        }}
      />
      <ul class="pu-combobox__list" role="listbox">
        <Show when={() => filtered().length === 0}>
          {() => {
            const li = document.createElement("li");
            li.className = "pu-combobox__empty";
            li.textContent = "No matches";
            return li;
          }}
        </Show>
        <For each={filtered}>
          {(opt, index) => (
            <li role="presentation">
              <button
                type="button"
                role="option"
                class={() =>
                  cx(
                    "pu-combobox__option",
                    getValue() === opt().value && "is-selected",
                    active() === index() && "is-active",
                  )
                }
                disabled={() => !!opt().disabled}
                onClick={() => pick(opt())}
                onMouseEnter={() => active.set(index())}
              >
                {() => opt().label}
              </button>
            </li>
          )}
        </For>
      </ul>
    </div>
  );
});
