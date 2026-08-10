/**
 * @power-ui/animate
 *
 * Signal-native motion. Learn it in one line:
 *   animate(mySignal, 100, { duration: 300 })
 *
 * Optional spring feel:
 *   animate(mySignal, 100, spring())
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
