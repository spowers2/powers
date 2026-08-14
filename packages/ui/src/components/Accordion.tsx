import { signal } from "@power-ux/core";
import { For, component, mergeProps, type ComponentProps } from "@power-ux/dom";
import { cx } from "../utils.js";
import { createStyleSheet } from "../styles.js";

export type AccordionItem = {
  id: string;
  title: string;
  content: unknown;
  disabled?: boolean;
};

export type AccordionProps = {
  items: AccordionItem[] | (() => AccordionItem[]);
  /** Controlled open ids (multi) */
  value?: string[] | (() => string[]);
  defaultValue?: string[];
  /** Only one panel open at a time */
  single?: boolean;
  onChange?: (ids: string[]) => void;
  class?: string | (() => string);
};

const ensure = createStyleSheet(
  "accordion",
  `
.pu-accordion { display: flex; flex-direction: column; gap: 0.35rem; width: 100%; }
.pu-accordion__item {
  border: 1px solid var(--pu-color-border);
  border-radius: var(--pu-radius-md);
  background: var(--pu-color-surface);
  overflow: hidden;
  transition:
    border-color var(--pu-duration) var(--pu-ease),
    box-shadow var(--pu-duration) var(--pu-ease);
}
.pu-accordion__item.is-open {
  border-color: color-mix(in srgb, var(--pu-color-accent) 28%, var(--pu-color-border));
  box-shadow: var(--pu-shadow-xs);
}
.pu-accordion__trigger {
  width: 100%;
  appearance: none;
  border: 0;
  background: transparent;
  text-align: left;
  font: inherit;
  font-size: var(--pu-text-sm);
  font-weight: var(--pu-font-semibold);
  color: var(--pu-color-text);
  padding: 0.75rem 0.9rem;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
  transition: background var(--pu-duration-fast) var(--pu-ease);
}
.pu-accordion__trigger:hover:not(:disabled) {
  background: var(--pu-color-surface-2);
}
.pu-accordion__trigger:disabled { opacity: 0.5; cursor: not-allowed; }
.pu-accordion__chevron {
  color: var(--pu-color-text-muted);
  transition: transform var(--pu-duration) var(--pu-ease-out);
  font-size: 0.75rem;
}
.pu-accordion__item.is-open .pu-accordion__chevron { transform: rotate(180deg); }
.pu-accordion__panel {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows var(--pu-duration-slow) var(--pu-ease-out);
}
.pu-accordion__item.is-open .pu-accordion__panel {
  grid-template-rows: 1fr;
}
.pu-accordion__panel-inner {
  overflow: hidden;
  min-height: 0;
  padding: 0 0.9rem;
  font-size: var(--pu-text-sm);
  color: var(--pu-color-text-muted);
  line-height: 1.5;
  opacity: 0;
  transform: translateY(-4px);
  transition:
    opacity var(--pu-duration) var(--pu-ease-out),
    transform var(--pu-duration) var(--pu-ease-out),
    padding var(--pu-duration-slow) var(--pu-ease-out);
}
.pu-accordion__item.is-open .pu-accordion__panel-inner {
  opacity: 1;
  transform: translateY(0);
  padding-bottom: 0.85rem;
}
@media (prefers-reduced-motion: reduce) {
  .pu-accordion__panel,
  .pu-accordion__panel-inner,
  .pu-accordion__chevron { transition: none; }
}
`,
);

export const Accordion = component((raw: AccordionProps) => {
  ensure();
  const props = mergeProps(
    { single: false, defaultValue: [] as string[] },
    raw,
  ) as ComponentProps<
    AccordionProps & { single: boolean; defaultValue: string[] }
  >;

  const internal = signal<string[]>([...props.defaultValue]);

  const openIds = (): string[] => {
    if (props.value !== undefined) {
      return typeof props.value === "function"
        ? (props.value as () => string[])()
        : props.value;
    }
    return internal();
  };

  const setOpen = (ids: string[]) => {
    if (props.value === undefined) internal.set(ids);
    props.onChange?.(ids);
  };

  const toggle = (id: string) => {
    const cur = openIds();
    const on = cur.includes(id);
    if (props.single) {
      setOpen(on ? [] : [id]);
    } else if (on) {
      setOpen(cur.filter((x) => x !== id));
    } else {
      setOpen([...cur, id]);
    }
  };

  const getItems = () =>
    typeof props.items === "function"
      ? (props.items as () => AccordionItem[])()
      : (props.items ?? []);

  return (
    <div
      class={() =>
        cx(
          "pu-accordion",
          typeof props.class === "function" ? props.class() : props.class,
        )
      }
      ref={(el) => ensure(el.ownerDocument)}
    >
      <For each={getItems}>
        {(item) => (
          <div
            class={() =>
              cx(
                "pu-accordion__item",
                openIds().includes(item().id) && "is-open",
              )
            }
          >
            <button
              type="button"
              class="pu-accordion__trigger"
              aria-expanded={() => openIds().includes(item().id)}
              disabled={() => !!item().disabled}
              onClick={() => toggle(item().id)}
            >
              <span>{() => item().title}</span>
              <span class="pu-accordion__chevron" aria-hidden="true">
                ▾
              </span>
            </button>
            <div class="pu-accordion__panel">
              <div class="pu-accordion__panel-inner">
                {() => item().content as never}
              </div>
            </div>
          </div>
        )}
      </For>
    </div>
  );
});
