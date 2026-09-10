import { effect, signal } from "@lab206/core";

const STORAGE_KEY = "lp-space-motion";
const LEGACY_STORAGE_KEY = "lp-circuit-motion";

function defaultSpaceMotion(): boolean {
  if (typeof window === "undefined") return true;
  try {
    const stored =
      localStorage.getItem(STORAGE_KEY) ??
      localStorage.getItem(LEGACY_STORAGE_KEY);
    if (stored === "1") return true;
    if (stored === "0") return false;
  } catch {
    /* private mode */
  }
  return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Slow starfield drift / twinkles — on by default unless OS reduced-motion is set. */
export const spaceMotion = signal(defaultSpaceMotion());

/** @deprecated Use spaceMotion — kept for any leftover imports. */
export const circuitMotion = spaceMotion;

function applyMotionAttr(on: boolean) {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.lpMotion = on ? "on" : "off";
}

// Sync before first paint so layers aren't stuck off for a frame.
applyMotionAttr(spaceMotion());

effect(() => {
  const on = spaceMotion();
  applyMotionAttr(on);
  try {
    localStorage.setItem(STORAGE_KEY, on ? "1" : "0");
  } catch {
    /* ignore */
  }
});

export function setSpaceMotion(on: boolean) {
  spaceMotion.set(on);
}

/** @deprecated Use setSpaceMotion */
export function setCircuitMotion(on: boolean) {
  setSpaceMotion(on);
}
