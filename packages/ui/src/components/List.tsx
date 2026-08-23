import { For, component, type ComponentProps } from "@lab206/dom";
import { cx } from "../utils.js";
import { createStyleSheet } from "../styles.js";
import {
  applyRovingTabIndex,
  focusRovingItem,
  handleRovingKeydown,
  listRovingItems,
} from "../rovingFocus.js";

export type ListItemData = {
  id: string;
  label: string;
  description?: string;
  meta?: string;
  disabled?: boolean;
};

export type ListProps = {
  items: ListItemData[] | (() => ListItemData[]);
  /** Selected id (optional highlight) */
  value?: string | (() => string);
  onSelect?: (id: string) => void;
  class?: string | (() => string);
};

const OPT_SEL = '[role="option"]:not([disabled])';

const ensure = createStyleSheet(
  "list",
  `
.pu-list {
  list-style: none;
  margin: 0;
  padding: 0.25rem;
  border: 1px solid var(--pu-color-border);
  border-radius: var(--pu-radius-lg);
  background: var(--pu-color-surface);
  overflow: hidden;
}
.pu-list__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  width: 100%;
  appearance: none;
  border: 0;
  background: transparent;
  text-align: left;
  font: inherit;
  padding: 0.7rem 0.85rem;
  border-radius: var(--pu-radius-md);
  cursor: pointer;
  color: var(--pu-color-text);
  transition:
    background var(--pu-duration) var(--pu-ease-out),
    transform var(--pu-duration-fast) var(--pu-ease-out),
    box-shadow var(--pu-duration) var(--pu-ease-out);
}
.pu-list__item:hover:not(:disabled) {
  background: var(--pu-color-surface-2);
  transform: translateX(2px);
}
.pu-list__item.is-selected {
  background: color-mix(in srgb, var(--pu-color-accent) 12%, transparent);
  box-shadow: inset 2px 0 0 var(--pu-color-accent);
}
.pu-list__item:focus-visible:not(:disabled) {
  outline: none;
  background: var(--pu-color-surface-2);
  box-shadow:
    inset 2px 0 0 var(--pu-color-accent),
    0 0 0 2px color-mix(in srgb, var(--pu-color-focus) 40%, transparent);
}
.pu-list__item:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}
@media (prefers-reduced-motion: reduce) {
  .pu-list__item { transition: none; }
  .pu-list__item:hover:not(:disabled) { transform: none; }
}
.pu-list__main {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  min-width: 0;
}
.pu-list__label {
  font-size: var(--pu-text-sm);
  font-weight: var(--pu-font-medium);
}
.pu-list__desc {
  font-size: var(--pu-text-xs);
  color: var(--pu-color-text-muted);
  line-height: 1.4;
}
.pu-list__meta {
  font-size: var(--pu-text-xs);
  color: var(--pu-color-text-muted);
  font-variant-numeric: tabular-nums;
  flex-shrink: 0;
}
`,
);

/** Interactive list group with arrow-key roving focus. */
export const List = component((raw: ListProps) => {
  ensure();
  const props = raw as ComponentProps<ListProps>;
  let listEl: HTMLElement | null = null;

  const getItems = () =>
    typeof props.items === "function"
      ? (props.items as () => ListItemData[])()
      : (props.items ?? []);
  const selected = () =>
    typeof props.value === "function"
      ? (props.value as () => string)()
      : (props.value ?? "");

  const syncTabIndex = () => {
    if (!listEl) return;
    const opts = listRovingItems(listEl, OPT_SEL);
    const idx = opts.findIndex(
      (el) => el.getAttribute("data-list-id") === selected(),
    );
    applyRovingTabIndex(opts, idx >= 0 ? idx : 0);
  };

  return (
    <ul
      class={() =>
        cx(
          "pu-list",
          typeof props.class === "function" ? props.class() : props.class,
        )
      }
      role="listbox"
      tabindex={0}
      aria-activedescendant={() => {
        const id = selected();
        return id ? `pu-list-opt-${id}` : undefined;
      }}
      ref={(el) => {
        listEl = el;
        ensure(el.ownerDocument);
        window.setTimeout(syncTabIndex, 0);
      }}
      onFocus={() => {
        // When listbox receives focus, move into an option
        if (!listEl) return;
        if (listEl.contains(listEl.ownerDocument.activeElement) &&
            listEl.ownerDocument.activeElement !== listEl) {
          return;
        }
        const opts = listRovingItems(listEl, OPT_SEL);
        const idx = opts.findIndex(
          (el) => el.getAttribute("data-list-id") === selected(),
        );
        focusRovingItem(opts, idx >= 0 ? idx : 0);
      }}
      onKeyDown={(e: KeyboardEvent) => {
        if (!listEl) return;
        handleRovingKeydown(e, listEl, OPT_SEL, {
          orientation: "vertical",
          loop: true,
          onActivate: (el) => {
            const id = el.getAttribute("data-list-id");
            if (id) props.onSelect?.(id);
          },
          onMove: (el) => {
            // Optional: live-select on move — keep selection on activate only
            void el;
          },
        });
      }}
    >
      <For each={getItems}>
        {(item) => (
          <li role="none" style={{ display: "block", margin: 0, padding: 0 }}>
            <button
              type="button"
              role="option"
              tabindex={-1}
              id={() => `pu-list-opt-${item().id}`}
              data-list-id={() => item().id}
              class={() =>
                cx(
                  "pu-list__item",
                  selected() === item().id && "is-selected",
                )
              }
              aria-selected={() => selected() === item().id}
              disabled={() => !!item().disabled}
              onClick={() => props.onSelect?.(item().id)}
              onFocus={() => {
                if (!listEl) return;
                const opts = listRovingItems(listEl, OPT_SEL);
                const idx = opts.findIndex(
                  (el) => el.getAttribute("data-list-id") === item().id,
                );
                if (idx >= 0) applyRovingTabIndex(opts, idx);
              }}
            >
              <span class="pu-list__main">
                <span class="pu-list__label">{() => item().label}</span>
                {() =>
                  item().description
                    ? (() => {
                        const s = document.createElement("span");
                        s.className = "pu-list__desc";
                        s.textContent = item().description!;
                        return s;
                      })()
                    : null
                }
              </span>
              {() =>
                item().meta
                  ? (() => {
                      const s = document.createElement("span");
                      s.className = "pu-list__meta";
                      s.textContent = item().meta!;
                      return s;
                    })()
                  : null
              }
            </button>
          </li>
        )}
      </For>
    </ul>
  );
});
