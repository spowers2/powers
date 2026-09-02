import { effect, signal } from "@lab206/core";

const STORAGE_KEY = "lp-circuit-motion";

function defaultCircuitMotion(): boolean {
  if (typeof window === "undefined") return true;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "1") return true;
    if (stored === "0") return false;
  } catch {
    /* private mode */
  }
  return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Traveling circuit pulses — on by default unless OS reduced-motion is set. */
export const circuitMotion = signal(defaultCircuitMotion());

function applyMotionAttr(on: boolean) {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.lpMotion = on ? "on" : "off";
}

// Sync before first paint so pulses aren't stuck off for a frame.
applyMotionAttr(circuitMotion());

effect(() => {
  const on = circuitMotion();
  applyMotionAttr(on);
  try {
    localStorage.setItem(STORAGE_KEY, on ? "1" : "0");
  } catch {
    /* ignore */
  }
});

export function setCircuitMotion(on: boolean) {
  circuitMotion.set(on);
}
