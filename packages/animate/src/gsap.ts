/**
 * Optional GSAP adapter for Powers.
 *
 * Install peer: `pnpm add gsap`
 * Import: `import { gsapAnimate } from "@lab206/animate/gsap"`
 *
 * Default motion remains `@lab206/animate` (no GSAP required).
 * Use this for timelines, custom eases, ScrollTrigger (via `vars`), etc.
 */
import gsap from "gsap";
import { createGsapBridge, type GsapLike } from "./gsap-bridge.js";

export {
  createGsapBridge,
  type GsapLike,
  type GsapAnimateOptions,
  type GsapBridge,
} from "./gsap-bridge.js";

// Cast: we only use to/fromTo + tween.kill
const bridge = createGsapBridge(gsap as unknown as GsapLike);

/** Animate a number signal with GSAP (duration in ms, same as `animate()`). */
export const gsapAnimate = bridge.gsapAnimate;

/** GSAP `fromTo` for a number signal. */
export const gsapFromTo = bridge.gsapFromTo;

/** Re-export native cancel so one import path covers both engines. */
export { cancel } from "./registry.js";
