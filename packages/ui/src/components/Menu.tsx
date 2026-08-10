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
  margin: 0;
  padding: 0;
}
.pu-menu__item {
  appearance: none;
  border: 0;
  background: transparent;
  text-align: left;
  width: 100%;
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
.pu-menu__item:hover:not(:disabled),
.pu-menu__item:focus-visible:not(:disabled) {
  background: var(--pu-color-surface-2);
  outline: none;
}
.pu-menu__item:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}
.pu-menu__item--danger {
  color: var(--pu-color-danger);
}
.pu-menu__item--danger:hover:not(:disabled),
.pu-menu__item--danger:focus-visible:not(:disabled) {
  background: color-mix(in srgb, var(--pu-color-danger) 12%, transparent);
}
`;

function ensureStyles(doc: Document = document) {
  if (typeof doc === "undefined") return;
  if (doc.querySelector('style[data-pu-ui="menu"]')) return;
  const el = doc.createElement("style");
  el.setAttribute("data-pu-ui", "menu");
  el.textContent = styles;
  doc.head.appendChild(el);
}

/**
 * Action menu built on Popover. Uncontrolled open state by default.
 * Escape / outside click handled by Popover (iframe-safe).
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
    <div
      class={() =>
        cx(
          "pu-menu-root",
          typeof props.class === "function" ? props.class() : props.class,
        )
      }
      ref={(el) => ensureStyles(el.ownerDocument)}
    >
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
                onClick={(e: MouseEvent) => {
                  e.stopPropagation();
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
    </div>
  );
});
