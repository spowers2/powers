import type { Animatable } from "./types.js";
import type { AnimationPlayback } from "./types.js";

/** One active animation per signal — new animate() interrupts the previous. */
const active = new WeakMap<Animatable, AnimationPlayback>();

export function getActive(target: Animatable): AnimationPlayback | undefined {
  return active.get(target);
}

export function setActive(
  target: Animatable,
  playback: AnimationPlayback,
): void {
  active.set(target, playback);
}

export function clearActive(
  target: Animatable,
  playback: AnimationPlayback,
): void {
  if (active.get(target) === playback) {
    active.delete(target);
  }
}

/** Cancel the in-flight animation on a signal, if any. */
export function cancel(target: Animatable): void {
  const current = active.get(target);
  current?.cancel();
}
