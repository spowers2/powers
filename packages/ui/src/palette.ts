import { signal, effect, type Signal } from "@lab206/core";

/**
 * Preview palettes for the design system.
 * - `instrument` — current default (cool navy + green signal)
 * - `dual` — dual electric (navy primary + cyan secondary; green = success only)
 */
export type PaletteId = "instrument" | "dual";

export interface PaletteController {
  id: Signal<PaletteId>;
  set(id: PaletteId): void;
  toggle(): void;
  /** Apply `data-pu-palette` on documentElement (or target). */
  bind(target?: Element): () => void;
}

const STORAGE_KEY = "pu-palette";

function readStored(): PaletteId | null {
  if (typeof localStorage === "undefined") return null;
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === "instrument" || v === "dual") return v;
  } catch {
    /* private mode */
  }
  return null;
}

function writeStored(id: PaletteId) {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, id);
  } catch {
    /* private mode */
  }
}

/**
 * Switchable token palette via `data-pu-palette` on `<html>`.
 * Default: `dual` for preview (option 3); flip to `instrument` to restore the prior look.
 */
export function createPalette(initial: PaletteId = "dual"): PaletteController {
  // Prefer last choice so “Instrument” sticks after you flip back
  const start = readStored() ?? initial;
  const id = signal<PaletteId>(start);

  function set(next: PaletteId) {
    id.set(next);
    writeStored(next);
  }

  function toggle() {
    set(id() === "dual" ? "instrument" : "dual");
  }

  function bind(target?: Element) {
    const el =
      target ??
      (typeof document !== "undefined" ? document.documentElement : null);
    if (!el) return () => {};

    return effect(() => {
      el.setAttribute("data-pu-palette", id());
    });
  }

  return { id, set, toggle, bind };
}
