import { signal, type Signal } from "@powers/core";
import { For, component, type ComponentProps } from "@powers/dom";
import { cx } from "../utils.js";

export type ToastTone = "info" | "success" | "danger";

export type ToastItem = {
  id: number;
  title: string;
  description?: string;
  tone: ToastTone;
};

export type ToastController = {
  items: Signal<ToastItem[]>;
  push: (opts: {
    title: string;
    description?: string;
    tone?: ToastTone;
    duration?: number;
  }) => number;
  dismiss: (id: number) => void;
  clear: () => void;
};

let nextId = 1;

/**
 * Create a toast queue. Call `push()` from event handlers; mount `<Toaster />`
 * once near the app root.
 */
export function createToaster(): ToastController {
  const items = signal<ToastItem[]>([]);

  function dismiss(id: number) {
    items.update((list) => list.filter((t) => t.id !== id));
  }

  function push(opts: {
    title: string;
    description?: string;
    tone?: ToastTone;
    duration?: number;
  }): number {
    const id = nextId++;
    const item: ToastItem = {
      id,
      title: opts.title,
      tone: opts.tone ?? "info",
      ...(opts.description !== undefined
        ? { description: opts.description }
        : {}),
    };
    items.update((list) => [...list, item].slice(-5));
    const ms = opts.duration ?? 3200;
    if (ms > 0 && typeof window !== "undefined") {
      window.setTimeout(() => dismiss(id), ms);
    }
    return id;
  }

  return {
    items,
    push,
    dismiss,
    clear: () => items.set([]),
  };
}

export type ToasterProps = {
  toaster: ToastController;
  class?: string | (() => string);
};

const styles = `
.pu-toaster {
  position: fixed;
  right: 1rem;
  bottom: 1rem;
  z-index: var(--pu-z-toast);
  display: flex;
  flex-direction: column-reverse;
  gap: 0.5rem;
  width: min(22rem, calc(100vw - 2rem));
  pointer-events: none;
}
.pu-toast {
  pointer-events: auto;
  display: flex;
  align-items: flex-start;
  gap: 0.65rem;
  padding: 0.75rem 0.85rem;
  border-radius: var(--pu-radius-lg);
  background: var(--pu-color-surface-elevated);
  border: 1px solid var(--pu-color-border);
  box-shadow: var(--pu-shadow-float);
  animation: pu-toast-in var(--pu-duration) var(--pu-ease-out);
}
.pu-toast__body {
  flex: 1;
  min-width: 0;
}
.pu-toast__title {
  margin: 0;
  font-size: var(--pu-text-sm);
  font-weight: var(--pu-font-semibold);
  letter-spacing: -0.015em;
  color: var(--pu-color-text);
}
.pu-toast__desc {
  margin: 0.2rem 0 0;
  font-size: var(--pu-text-xs);
  color: var(--pu-color-text-muted);
  line-height: 1.4;
}
.pu-toast__close {
  appearance: none;
  border: 0;
  background: transparent;
  color: var(--pu-color-text-muted);
  cursor: pointer;
  font-size: 1rem;
  line-height: 1;
  padding: 0.1rem;
  border-radius: var(--pu-radius-sm);
}
.pu-toast__close:hover {
  color: var(--pu-color-text);
  background: var(--pu-color-surface-2);
}
.pu-toast--info {
  border-color: color-mix(in srgb, var(--pu-color-accent) 30%, var(--pu-color-border));
}
.pu-toast--success {
  border-color: color-mix(in srgb, var(--pu-sage-500) 40%, var(--pu-color-border));
}
.pu-toast--danger {
  border-color: color-mix(in srgb, var(--pu-color-danger) 40%, var(--pu-color-border));
}
.pu-toast__dot {
  width: 0.45rem;
  height: 0.45rem;
  border-radius: 50%;
  margin-top: 0.35rem;
  flex-shrink: 0;
  background: var(--pu-color-accent);
}
.pu-toast--success .pu-toast__dot { background: var(--pu-sage-500); }
.pu-toast--danger .pu-toast__dot { background: var(--pu-color-danger); }
@keyframes pu-toast-in {
  from { opacity: 0; transform: translateY(8px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
@media (prefers-reduced-motion: reduce) {
  .pu-toast { animation: none; }
}
`;

let injected = false;
function ensureStyles() {
  if (injected || typeof document === "undefined") return;
  injected = true;
  const el = document.createElement("style");
  el.setAttribute("data-pu-ui", "toast");
  el.textContent = styles;
  document.head.appendChild(el);
}

/**
 * Renders the toast stack for a `createToaster()` controller.
 */
export const Toaster = component((raw: ToasterProps) => {
  ensureStyles();
  const props = raw as ComponentProps<ToasterProps>;
  const toaster = props.toaster;

  return (
    <div
      class={() =>
        cx(
          "pu-toaster",
          typeof props.class === "function" ? props.class() : props.class,
        )
      }
      aria-live="polite"
      aria-relevant="additions"
    >
      <For each={() => toaster.items()}>
        {(item) => (
          <div
            class={() => `pu-toast pu-toast--${item().tone}`}
            role="status"
          >
            <span class="pu-toast__dot" aria-hidden="true" />
            <div class="pu-toast__body">
              <p class="pu-toast__title">{() => item().title}</p>
              <p
                class="pu-toast__desc"
                style={() =>
                  item().description
                    ? { display: "block" }
                    : { display: "none" }
                }
              >
                {() => item().description ?? ""}
              </p>
            </div>
            <button
              type="button"
              class="pu-toast__close"
              aria-label="Dismiss"
              onClick={() => toaster.dismiss(item().id)}
            >
              ×
            </button>
          </div>
        )}
      </For>
    </div>
  );
});
