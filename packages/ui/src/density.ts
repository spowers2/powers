import { effect, signal, type Signal } from "@power-ui/core";

export type Density = "comfortable" | "compact";

export interface DensityController {
  density: Signal<Density>;
  setDensity(next: Density): void;
  toggle(): void;
  /** Apply `data-pu-density` (default: document.documentElement) */
  bind(target?: Element): () => void;
}

/**
 * Control spacing / control height density via CSS tokens.
 *
 * @example
 * ```ts
 * const density = createDensity("comfortable");
 * density.bind();
 * density.setDensity("compact");
 * ```
 */
export function createDensity(initial: Density = "comfortable"): DensityController {
  const density = signal<Density>(initial);

  function setDensity(next: Density) {
    density.set(next);
  }

  function toggle() {
    density.update((d) => (d === "comfortable" ? "compact" : "comfortable"));
  }

  function bind(target?: Element) {
    const el =
      target ??
      (typeof document !== "undefined" ? document.documentElement : null);
    if (!el) return () => {};

    return effect(() => {
      el.setAttribute("data-pu-density", density());
    });
  }

  return { density, setDensity, toggle, bind };
}
