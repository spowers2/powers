import { signal, effect } from "@powers/core";
import { For, component, mergeProps, type ComponentProps } from "@powers/dom";
import { cx } from "../utils.js";
import {
  applyRovingTabIndex,
  handleRovingKeydown,
  listRovingItems,
} from "../rovingFocus.js";

export type TabItem = {
  id: string;
  label: string;
  content: unknown;
  disabled?: boolean;
};

export type TabsProps = {
  items: TabItem[] | (() => TabItem[]);
  /** Controlled value (id) */
  value?: string | (() => string);
  /** Uncontrolled initial id */
  defaultValue?: string;
  onChange?: (id: string) => void;
  class?: string | (() => string);
};

const TAB_SEL = '[role="tab"]:not([disabled])';

const styles = `
.pu-tabs {
  display: flex;
  flex-direction: column;
  gap: var(--pu-space-4);
  min-width: 0;
}
.pu-tabs__list {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  padding: 3px;
  border-radius: var(--pu-radius-md);
  background: var(--pu-color-surface-sunken);
  border: 1px solid var(--pu-color-border);
  width: fit-content;
  max-width: 100%;
  overflow-x: auto;
}
.pu-tabs__tab {
  appearance: none;
  border: 0;
  background: transparent;
  color: var(--pu-color-text-muted);
  font: inherit;
  font-size: var(--pu-text-sm);
  font-weight: var(--pu-font-semibold);
  letter-spacing: -0.01em;
  padding: 0.45rem 0.9rem;
  border-radius: calc(var(--pu-radius-md) - 2px);
  cursor: pointer;
  white-space: nowrap;
  transition:
    background var(--pu-duration) var(--pu-ease-out),
    color var(--pu-duration) var(--pu-ease-out),
    box-shadow var(--pu-duration) var(--pu-ease-out),
    transform var(--pu-duration-fast) var(--pu-ease);
}
.pu-tabs__tab:hover:not(:disabled):not(.pu-tabs__tab--active) {
  color: var(--pu-color-text);
  background: color-mix(in srgb, var(--pu-color-surface) 60%, transparent);
}
.pu-tabs__tab:active:not(:disabled) {
  transform: scale(0.97);
}
.pu-tabs__tab--active {
  background: var(--pu-color-surface);
  color: var(--pu-color-text);
  box-shadow: var(--pu-shadow-sm);
}
.pu-tabs__tab:focus-visible {
  outline: none;
  box-shadow:
    var(--pu-shadow-sm),
    0 0 0 2px color-mix(in srgb, var(--pu-color-focus) 50%, transparent);
}
.pu-tabs__tab:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}
.pu-tabs__panel {
  min-width: 0;
  animation: pu-tabs-panel-in var(--pu-duration) var(--pu-ease-out);
}
@keyframes pu-tabs-panel-in {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}
@media (prefers-reduced-motion: reduce) {
  .pu-tabs__panel { animation: none; }
  .pu-tabs__tab { transition: none; }
}
`;

let injected = false;
function ensureStyles() {
  if (injected || typeof document === "undefined") return;
  injected = true;
  const el = document.createElement("style");
  el.setAttribute("data-pu-ui", "tabs");
  el.textContent = styles;
  document.head.appendChild(el);
}

/**
 * Segmented tabs with WAI-ARIA keyboard:
 * ArrowLeft/Right · Home/End move focus and activate · Tab exits to panel.
 */
export const Tabs = component((raw: TabsProps) => {
  ensureStyles();
  const props = mergeProps({}, raw) as ComponentProps<TabsProps>;
  let listEl: HTMLElement | null = null;

  const getItems = (): TabItem[] => {
    const i = props.items;
    return typeof i === "function" ? (i as () => TabItem[])() : (i ?? []);
  };
  const firstEnabledId = () => {
    const items = getItems();
    return items.find((t) => !t.disabled)?.id ?? items[0]?.id ?? "";
  };
  const internal = signal(props.defaultValue ?? firstEnabledId());

  const active = () => {
    if (props.value !== undefined) {
      return typeof props.value === "function"
        ? (props.value as () => string)()
        : props.value;
    }
    return internal();
  };

  const select = (id: string) => {
    const item = getItems().find((t) => t.id === id);
    if (!item || item.disabled) return;
    if (props.value === undefined) internal.set(id);
    props.onChange?.(id);
  };

  const tabIdOf = (el: HTMLElement) =>
    el.getAttribute("data-tab-id") ||
    el.id.replace(/^pu-tab-/, "") ||
    "";

  const syncTabIndex = () => {
    if (!listEl) return;
    const items = listRovingItems(listEl, TAB_SEL);
    const idx = items.findIndex((el) => tabIdOf(el) === active());
    applyRovingTabIndex(items, idx >= 0 ? idx : 0);
  };

  effect(() => {
    active(); // track
    // Defer so For has painted buttons
    const t = window.setTimeout(syncTabIndex, 0);
    return () => window.clearTimeout(t);
  });

  return (
    <div
      class={() =>
        cx(
          "pu-tabs",
          typeof props.class === "function" ? props.class() : props.class,
        )
      }
    >
      <div
        class="pu-tabs__list"
        role="tablist"
        aria-orientation="horizontal"
        ref={(el) => {
          listEl = el;
        }}
        onKeyDown={(e: KeyboardEvent) => {
          if (!listEl) return;
          handleRovingKeydown(e, listEl, TAB_SEL, {
            orientation: "horizontal",
            loop: true,
            onMove: (el) => {
              const id = tabIdOf(el);
              if (id) select(id);
            },
            onActivate: (el) => {
              const id = tabIdOf(el);
              if (id) select(id);
            },
          });
        }}
      >
        <For each={getItems}>
          {(item) => (
            <button
              type="button"
              role="tab"
              tabindex={-1}
              id={() => `pu-tab-${item().id}`}
              data-tab-id={() => item().id}
              aria-selected={() => active() === item().id}
              aria-controls={() => `pu-tabpanel-${item().id}`}
              disabled={() => !!item().disabled}
              class={() =>
                cx(
                  "pu-tabs__tab",
                  active() === item().id && "pu-tabs__tab--active",
                )
              }
              onClick={() => select(item().id)}
              onFocus={() => {
                // Keep roving index aligned when user tabs into the list
                if (!listEl) return;
                const items = listRovingItems(listEl, TAB_SEL);
                const idx = items.findIndex(
                  (el) => el.getAttribute("data-tab-id") === item().id,
                );
                if (idx >= 0) applyRovingTabIndex(items, idx);
              }}
            >
              {() => item().label}
            </button>
          )}
        </For>
      </div>
      <div
        class="pu-tabs__panel"
        role="tabpanel"
        id={() => `pu-tabpanel-${active()}`}
        aria-labelledby={() => `pu-tab-${active()}`}
        tabindex={0}
      >
        {() => {
          const cur = getItems().find((i) => i.id === active());
          return (cur?.content as never) ?? null;
        }}
      </div>
    </div>
  );
});
