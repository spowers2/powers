import { signal } from "@power-ui/core";
import { For, component, mergeProps, type ComponentProps } from "@power-ui/dom";
import { cx } from "../utils.js";
import { Popover } from "./Popover.js";

export type MenuItem = {
  id: string;
  label: string;
  disabled?: boolean;
  danger?: boolean;
};

export type MenuProps = {
  /** Items shown in the menu */
  items: MenuItem[] | (() => MenuItem[]);
  /** Trigger node (Button recommended) */
  trigger: unknown;
  /** Called when an enabled item is chosen */
  onSelect?: (id: string) => void;
  align?: "start" | "center" | "end";
  class?: string | (() => string);
};

const styles = `
.pu-menu {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 10.5rem;
  margin: calc(var(--pu-space-1) * -1);
}
.pu-menu__item {
  appearance: none;
  border: 0;
  background: transparent;
  text-align: left;
  font: inherit;
  font-size: var(--pu-text-sm);
  font-weight: var(--pu-font-medium);
  letter-spacing: -0.01em;
  color: var(--pu-color-text);
  padding: 0.5rem 0.65rem;
  border-radius: var(--pu-radius-sm);
  cursor: pointer;
  transition: background var(--pu-duration-fast) var(--pu-ease);
}
.pu-menu__item:hover:not(:disabled) {
  background: var(--pu-color-surface-2);
}
.pu-menu__item:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}
.pu-menu__item--danger {
  color: var(--pu-color-danger);
}
.pu-menu__item--danger:hover:not(:disabled) {
  background: color-mix(in srgb, var(--pu-color-danger) 10%, transparent);
}
`;

let injected = false;
function ensureStyles() {
  if (injected || typeof document === "undefined") return;
  injected = true;
  const el = document.createElement("style");
  el.setAttribute("data-pu-ui", "menu");
  el.textContent = styles;
  document.head.appendChild(el);
}

/**
 * Action menu built on Popover. Uncontrolled open state by default.
 */
export const Menu = component((raw: MenuProps) => {
  ensureStyles();
  const props = mergeProps({ align: "start" as const }, raw) as ComponentProps<
    MenuProps & { align: "start" | "center" | "end" }
  >;

  const open = signal(false);
  const getItems = (): MenuItem[] => {
    const i = props.items;
    return typeof i === "function" ? (i as () => MenuItem[])() : (i ?? []);
  };

  return (
    <Popover
      open={open}
      onOpenChange={(v) => open.set(v)}
      align={props.align}
      trigger={props.trigger}
    >
      <div class="pu-menu" role="menu">
        <For each={getItems}>
          {(item) => (
            <button
              type="button"
              role="menuitem"
              class={() =>
                cx(
                  "pu-menu__item",
                  item().danger && "pu-menu__item--danger",
                )
              }
              disabled={() => !!item().disabled}
              onClick={() => {
                if (item().disabled) return;
                props.onSelect?.(item().id);
                open.set(false);
              }}
            >
              {() => item().label}
            </button>
          )}
        </For>
      </div>
    </Popover>
  );
});
