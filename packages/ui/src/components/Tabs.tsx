import { signal } from "@power-ui/core";
import { For, component, mergeProps, type ComponentProps } from "@power-ui/dom";
import { cx } from "../utils.js";

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
    background var(--pu-duration) var(--pu-ease),
    color var(--pu-duration) var(--pu-ease),
    box-shadow var(--pu-duration) var(--pu-ease);
}
.pu-tabs__tab:hover:not(:disabled):not(.pu-tabs__tab--active) {
  color: var(--pu-color-text);
  background: color-mix(in srgb, var(--pu-color-surface) 60%, transparent);
}
.pu-tabs__tab--active {
  background: var(--pu-color-surface);
  color: var(--pu-color-text);
  box-shadow: var(--pu-shadow-sm);
}
.pu-tabs__tab:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}
.pu-tabs__panel {
  min-width: 0;
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
 * Segmented tabs (modern pill track). Controlled via `value` or uncontrolled `defaultValue`.
 */
export const Tabs = component((raw: TabsProps) => {
  ensureStyles();
  const props = mergeProps({}, raw) as ComponentProps<TabsProps>;
  const getItems = (): TabItem[] => {
    const i = props.items;
    return typeof i === "function" ? (i as () => TabItem[])() : (i ?? []);
  };
  const firstId = () => getItems()[0]?.id ?? "";
  const internal = signal(props.defaultValue ?? firstId());

  const active = () => {
    if (props.value !== undefined) {
      return typeof props.value === "function"
        ? (props.value as () => string)()
        : props.value;
    }
    return internal();
  };

  const select = (id: string) => {
    if (props.value === undefined) internal.set(id);
    props.onChange?.(id);
  };

  return (
    <div
      class={() =>
        cx(
          "pu-tabs",
          typeof props.class === "function" ? props.class() : props.class,
        )
      }
    >
      <div class="pu-tabs__list" role="tablist">
        <For each={getItems}>
          {(item) => (
            <button
              type="button"
              role="tab"
              id={() => `pu-tab-${item().id}`}
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
      >
        {() => {
          const cur = getItems().find((i) => i.id === active());
          return (cur?.content as never) ?? null;
        }}
      </div>
    </div>
  );
});
