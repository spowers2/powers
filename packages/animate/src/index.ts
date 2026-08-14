/**
 * @power-ui/animate
 *
 * Signal-native motion. Learn it in one line:
 *   animate(mySignal, 100, { duration: 300 })
 *
 * Optional spring feel:
 *   animate(mySignal, 100, spring())
 *
 * Optional GSAP (peer dependency):
 *   import { gsapAnimate } from "@power-ui/animate/gsap"
 *   — or createGsapBridge(gsap) from this package without importing gsap here
 */

export { animate, spring } from "./animate.js";
export { cancel } from "./registry.js";
export {
  prefersReducedMotion,
  setReducedMotionOverride,
} from "./reduced-motion.js";
export {
  installDriver,
  createTestClock,
  driver,
} from "./driver.js";
export { resolveEase, easeNames } from "./easings.js";
export { createGsapBridge } from "./gsap-bridge.js";
export type {
  GsapLike,
  GsapAnimateOptions,
  GsapBridge,
} from "./gsap-bridge.js";

export type {
  AnimateOptions,
  AnimationPlayback,
  Animatable,
  Ease,
  EaseName,
  EasingFn,
  FrameDriver,
  PlayState,
  SpringOptions,
  TweenOptions,
} from "./types.js";
