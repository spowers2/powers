import { signal, effect } from "@power-ux/core";
import { For, Show, component, mergeProps, type ComponentProps } from "@power-ux/dom";
import { cx } from "../utils.js";
import { attachOverlay } from "../overlay.js";
import { readBool, readProp, type MaybeReactive } from "../reactive.js";

export type ComboboxOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

export type ComboboxProps = {
  options: MaybeReactive<ComboboxOption[]>;
  value?: MaybeReactive<string>;
  placeholder?: string;
  disabled?: MaybeReactive<boolean>;
  /** Called with the selected option value */
  onChange?: (value: string) => void;
  /** Filter function — default: case-insensitive label includes query */
  filter?: (opt: ComboboxOption, query: string) => boolean;
  class?: MaybeReactive<string>;
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
  position: fixed;
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
  opacity: 0;
  transform: translateY(4px) scale(0.98);
  transform-origin: top center;
  transition:
    opacity var(--pu-duration) var(--pu-ease-out),
    transform var(--pu-duration) var(--pu-ease-out);
  /* Portaled to body — open class lives on the list itself */
}
.pu-combobox__list.is-open {
  display: block;
  opacity: 1;
  transform: translateY(0) scale(1);
}
.pu-combobox__list[data-side="top"] {
  transform-origin: bottom center;
}
@media (prefers-reduced-motion: reduce) {
  .pu-combobox__list { transition: none; transform: none; }
  .pu-combobox__list.is-open { transform: none; }
}
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
  let listEl: HTMLElement | null = null;
  let inputEl: HTMLInputElement | null = null;

  const placeList = () => {
    if (!rootEl || !listEl || !inputEl || !open()) return;
    const doc = rootEl.ownerDocument;
    const win = doc.defaultView ?? window;
    const gap = 4;
    const pad = 8;
    const rect = inputEl.getBoundingClientRect();
    const vw = win.innerWidth;
    const vh = win.innerHeight;
    const width = rect.width;
    listEl.style.width = `${Math.round(width)}px`;
    listEl.style.maxHeight = "";
    const naturalH = Math.min(listEl.scrollHeight || 224, 14 * 16);
    const spaceBelow = vh - rect.bottom - gap - pad;
    const spaceAbove = rect.top - gap - pad;
    const placeAbove =
      spaceBelow < Math.min(naturalH, 100) && spaceAbove > spaceBelow;
    const available = Math.max(96, placeAbove ? spaceAbove : spaceBelow);
    const maxH = Math.min(naturalH, available, 14 * 16);
    listEl.style.maxHeight = `${Math.round(maxH)}px`;
    const ph = Math.min(listEl.offsetHeight || maxH, maxH);
    let top = placeAbove ? rect.top - gap - ph : rect.bottom + gap;
    top = Math.min(Math.max(pad, top), Math.max(pad, vh - ph - pad));
    let left = rect.left;
    left = Math.min(Math.max(pad, left), Math.max(pad, vw - width - pad));
    listEl.dataset.side = placeAbove ? "top" : "bottom";
    listEl.style.top = `${Math.round(top)}px`;
    listEl.style.left = `${Math.round(left)}px`;
  };

  const getOptions = (): ComboboxOption[] =>
    readProp(props.options as MaybeReactive<ComboboxOption[]>) ?? [];

  const getValue = () =>
    readProp(props.value as MaybeReactive<string>) ?? "";

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
      listEl?.classList.remove("is-open");
    }
  });

  effect(() => {
    if (!open()) return;
    return attachOverlay({
      getRoot: () => rootEl,
      onClose: () => {
        open.set(false);
        query.set(selectedLabel());
        listEl?.classList.remove("is-open");
      },
      escape: true,
      dismissOutside: true,
      isInside: (node) => {
        if (rootEl?.contains(node)) return true;
        if (listEl?.contains(node)) return true;
        return false;
      },
      onAttach: ({ doc, win }) => {
        // Portal list to body so overflow:hidden parents (cards, drawers) cannot clip it
        if (listEl && listEl.parentNode !== doc.body) {
          doc.body.appendChild(listEl);
        }
        listEl?.classList.add("is-open");
        const onRepo = () => placeList();
        const placeTimer = win.setTimeout(() => {
          placeList();
          win.setTimeout(placeList, 16);
        }, 0);
        win.addEventListener("resize", onRepo);
        doc.addEventListener("scroll", onRepo, true);
        win.addEventListener("scroll", onRepo, true);
        return () => {
          win.clearTimeout(placeTimer);
          win.removeEventListener("resize", onRepo);
          doc.removeEventListener("scroll", onRepo, true);
          win.removeEventListener("scroll", onRepo, true);
          listEl?.classList.remove("is-open");
          // Keep portaled for next open (still in body) — fine
        };
      },
    });
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
        disabled={() => readBool(props.disabled as MaybeReactive<boolean>)}
        value={query}
        ref={(el) => {
          inputEl = el as HTMLInputElement;
        }}
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
      <ul
        class="pu-combobox__list"
        role="listbox"
        ref={(el) => {
          listEl = el;
        }}
      >
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
