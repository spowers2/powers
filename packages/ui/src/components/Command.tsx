import { signal, effect } from "@power-ux/core";
import { For, Show, component, mergeProps, type ComponentProps } from "@power-ux/dom";
import { cx } from "../utils.js";
import { attachOverlay } from "../overlay.js";
import { readBool, readStr, type MaybeReactive } from "../reactive.js";

export type CommandItem = {
  id: string;
  label: string;
  hint?: string;
  group?: string;
  disabled?: boolean;
};

export type CommandProps = {
  open: MaybeReactive<boolean>;
  onOpenChange?: (open: boolean) => void;
  items: CommandItem[] | (() => CommandItem[]);
  placeholder?: string;
  /**
   * Async command sources: show a loading row while `items` is still settling.
   * Use a reactive `items` function + toggle `loading` around the fetch.
   */
  loading?: MaybeReactive<boolean>;
  /** Empty-state copy (default: “No commands match”) */
  emptyText?: MaybeReactive<string>;
  /** Loading-state copy (default: “Loading…”) */
  loadingText?: MaybeReactive<string>;
  onSelect?: (id: string) => void;
  class?: MaybeReactive<string>;
};

const styles = `
.pu-command-root {
  position: fixed;
  inset: 0;
  z-index: var(--pu-z-overlay);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: min(20vh, 6rem) var(--pu-space-4) var(--pu-space-4);
  pointer-events: none;
  opacity: 0;
  visibility: hidden;
  transition: opacity var(--pu-duration) var(--pu-ease-out),
    visibility var(--pu-duration) var(--pu-ease-out);
}
.pu-command-root--open {
  pointer-events: auto;
  opacity: 1;
  visibility: visible;
}
.pu-command-backdrop {
  position: absolute;
  inset: 0;
  background: var(--pu-overlay-scrim);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
}
.pu-command {
  position: relative;
  width: min(32rem, 100%);
  max-height: min(28rem, 70vh);
  display: flex;
  flex-direction: column;
  border-radius: var(--pu-radius-xl);
  background: var(--pu-color-surface-elevated);
  border: 1px solid var(--pu-color-border);
  box-shadow: var(--pu-shadow-float);
  overflow: hidden;
  transform: translateY(8px) scale(0.98);
  transition: transform var(--pu-duration-slow) var(--pu-ease-out);
}
.pu-command-root--open .pu-command {
  transform: translateY(0) scale(1);
}
.pu-command__input {
  width: 100%;
  border: 0;
  border-bottom: 1px solid var(--pu-color-border);
  background: transparent;
  color: var(--pu-color-text);
  font: inherit;
  font-size: var(--pu-text-md);
  padding: 0.9rem 1rem;
  outline: none;
}
.pu-command__input::placeholder { color: var(--pu-color-text-muted); }
.pu-command__input:focus-visible {
  box-shadow: inset 0 0 0 2px color-mix(in srgb, var(--pu-color-focus) 35%, transparent);
}
.pu-command__list {
  overflow: auto;
  padding: 0.35rem;
  flex: 1;
  min-height: 0;
}
.pu-command__item {
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
  font-size: var(--pu-text-sm);
  color: var(--pu-color-text);
  padding: 0.55rem 0.7rem;
  border-radius: var(--pu-radius-md);
  cursor: pointer;
}
.pu-command__item:hover:not(:disabled),
.pu-command__item.is-active:not(:disabled) {
  background: color-mix(in srgb, var(--pu-color-accent) 12%, var(--pu-color-surface-2));
}
.pu-command__item:focus-visible:not(:disabled) {
  outline: none;
  box-shadow:
    0 0 0 2px var(--pu-color-surface-elevated),
    0 0 0 4px color-mix(in srgb, var(--pu-color-focus) 55%, transparent);
  background: color-mix(in srgb, var(--pu-color-accent) 12%, var(--pu-color-surface-2));
}
.pu-command__item:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}
.pu-command__hint {
  font-size: var(--pu-text-xs);
  color: var(--pu-color-text-muted);
  font-family: var(--pu-font-mono);
}
.pu-command__status {
  padding: 1.25rem;
  text-align: center;
  color: var(--pu-color-text-muted);
  font-size: var(--pu-text-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.55rem;
}
.pu-command__status--loading::before {
  content: "";
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 50%;
  border: 2px solid color-mix(in srgb, var(--pu-color-accent) 30%, transparent);
  border-top-color: var(--pu-color-accent);
  animation: pu-command-spin 0.7s linear infinite;
  flex-shrink: 0;
}
@keyframes pu-command-spin {
  to { transform: rotate(360deg); }
}
@media (prefers-reduced-motion: reduce) {
  .pu-command__status--loading::before { animation: none; opacity: 0.7; }
}
.pu-command__footer {
  border-top: 1px solid var(--pu-color-border);
  padding: 0.45rem 0.75rem;
  font-size: var(--pu-text-xs);
  color: var(--pu-color-text-muted);
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}
@media (prefers-reduced-motion: reduce) {
  .pu-command-root, .pu-command { transition: none; }
}
`;

function ensureStyles(doc: Document = document) {
  if (typeof doc === "undefined") return;
  if (doc.querySelector('style[data-pu-ui="command"]')) return;
  const el = doc.createElement("style");
  el.setAttribute("data-pu-ui", "command");
  el.textContent = styles;
  doc.head.appendChild(el);
}

/**
 * Command palette (⌘K style): search + run an action.
 * Control with `open` + `onOpenChange`. Esc / backdrop close via `attachOverlay`.
 * For async sources: reactive `items` + `loading`.
 */
export const Command = component((raw: CommandProps) => {
  ensureStyles();
  const props = mergeProps(
    {
      placeholder: "Type a command…",
      emptyText: "No commands match",
      loadingText: "Loading…",
    },
    raw,
  ) as ComponentProps<
    CommandProps & {
      placeholder: string;
      emptyText: string;
      loadingText: string;
    }
  >;

  const isOpen = () => readBool(props.open as MaybeReactive<boolean>);
  const isLoading = () =>
    readBool(props.loading as MaybeReactive<boolean> | undefined);
  const query = signal("");
  const active = signal(0);
  let rootEl: HTMLElement | null = null;
  let panelEl: HTMLElement | null = null;
  let inputEl: HTMLInputElement | null = null;

  const getItems = (): CommandItem[] => {
    const i = props.items;
    return typeof i === "function" ? (i as () => CommandItem[])() : (i ?? []);
  };

  const filtered = () => {
    if (isLoading()) return [] as CommandItem[];
    const q = query().trim().toLowerCase();
    const list = getItems();
    if (!q) return list;
    return list.filter(
      (it) =>
        it.label.toLowerCase().includes(q) ||
        (it.hint?.toLowerCase().includes(q) ?? false) ||
        (it.group?.toLowerCase().includes(q) ?? false),
    );
  };

  effect(() => {
    if (!isOpen()) {
      query.set("");
      active.set(0);
      return;
    }
    return attachOverlay({
      getRoot: () => rootEl,
      getFocusRoot: () => panelEl,
      onClose: () => props.onOpenChange?.(false),
      scrollLock: true,
      escape: true,
      onAttach: ({ doc, win }) => {
        ensureStyles(doc);
        const t = win.setTimeout(() => inputEl?.focus(), 0);
        return () => win.clearTimeout(t);
      },
    });
  });

  const run = (item: CommandItem) => {
    if (item.disabled || isLoading()) return;
    props.onSelect?.(item.id);
    props.onOpenChange?.(false);
  };

  return (
    <div
      class={() =>
        cx(
          "pu-command-root",
          isOpen() && "pu-command-root--open",
          isLoading() && "pu-command-root--loading",
          typeof props.class === "function" ? props.class() : props.class,
        )
      }
      aria-hidden={() => (!isOpen() ? "true" : "false")}
      ref={(el) => {
        rootEl = el;
        ensureStyles(el.ownerDocument);
      }}
    >
      <div
        class="pu-command-backdrop"
        onClick={() => props.onOpenChange?.(false)}
        aria-hidden="true"
      />
      <div
        class="pu-command"
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        aria-busy={() => (isLoading() ? "true" : "false")}
        onClick={(e: MouseEvent) => e.stopPropagation()}
        ref={(el) => {
          panelEl = el;
        }}
      >
        <input
          class="pu-command__input"
          type="text"
          role="combobox"
          aria-expanded="true"
          aria-busy={() => (isLoading() ? "true" : "false")}
          placeholder={props.placeholder}
          value={query}
          ref={(el) => {
            inputEl = el as HTMLInputElement;
          }}
          onInput={(e: Event) => {
            query.set((e.target as HTMLInputElement).value);
            active.set(0);
          }}
          onKeyDown={(e: KeyboardEvent) => {
            if (isLoading()) return;
            const list = filtered();
            if (e.key === "ArrowDown") {
              e.preventDefault();
              active.set(Math.min(Math.max(list.length - 1, 0), active() + 1));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              active.set(Math.max(0, active() - 1));
            } else if (e.key === "Enter") {
              e.preventDefault();
              const item = list[active()];
              if (item) run(item);
            }
          }}
        />
        <div class="pu-command__list" role="listbox">
          <Show when={() => isLoading()}>
            {() => {
              const d = document.createElement("div");
              d.className = "pu-command__status pu-command__status--loading";
              d.setAttribute("role", "status");
              d.textContent =
                readStr(props.loadingText as MaybeReactive<string>) ||
                "Loading…";
              return d;
            }}
          </Show>
          <Show when={() => !isLoading() && filtered().length === 0}>
            {() => {
              const d = document.createElement("div");
              d.className = "pu-command__status";
              d.setAttribute("role", "status");
              d.textContent =
                readStr(props.emptyText as MaybeReactive<string>) ||
                "No commands match";
              return d;
            }}
          </Show>
          <Show when={() => !isLoading()}>
            {() => (
              <For each={filtered}>
                {(item, index) => (
                  <button
                    type="button"
                    role="option"
                    class={() =>
                      cx(
                        "pu-command__item",
                        active() === index() && "is-active",
                      )
                    }
                    disabled={() => !!item().disabled}
                    onClick={() => run(item())}
                    onMouseEnter={() => active.set(index())}
                  >
                    <span>{() => item().label}</span>
                    <span class="pu-command__hint">
                      {() => item().hint ?? ""}
                    </span>
                  </button>
                )}
              </For>
            )}
          </Show>
        </div>
        <div class="pu-command__footer">
          <span>↑↓ navigate</span>
          <span>↵ run</span>
          <span>esc close</span>
        </div>
      </div>
    </div>
  );
});
