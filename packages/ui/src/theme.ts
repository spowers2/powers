import { signal, type Signal } from "@power-ux/core";
import { effect } from "@power-ux/core";

export type ThemeMode = "light" | "dark";

export interface ThemeController {
  /** Current mode signal */
  mode: Signal<ThemeMode>;
  setMode(mode: ThemeMode): void;
  toggle(): void;
  /** Apply `data-pu-theme` on an element (default: document.documentElement) */
  bind(target?: Element): () => void;
}

/**
 * Create a theme controller. Tokens switch via `data-pu-theme` on the root.
 *
 * @example
 * ```ts
 * const theme = createTheme("dark");
 * theme.bind(); // <html data-pu-theme="dark">
 * theme.toggle();
 * ```
 */
export function createTheme(initial: ThemeMode = "light"): ThemeController {
  const mode = signal<ThemeMode>(initial);

  function setMode(next: ThemeMode) {
    mode.set(next);
  }

  function toggle() {
    mode.update((m) => (m === "light" ? "dark" : "light"));
  }

  function bind(target?: Element) {
    const el =
      target ??
      (typeof document !== "undefined" ? document.documentElement : null);
    if (!el) return () => {};

    return effect(() => {
      el.setAttribute("data-pu-theme", mode());
    });
  }

  return { mode, setMode, toggle, bind };
}
