import type { Signal } from "@powers/core";

/** Easing function: progress 0..1 → eased 0..1. */
export type EasingFn = (t: number) => number;

/** Named easings shipped with the library. */
export type EaseName =
  | "linear"
  | "easeIn"
  | "easeOut"
  | "easeInOut"
  | "easeInCubic"
  | "easeOutCubic"
  | "easeInOutCubic"
  | "easeInBack"
  | "easeOutBack"
  | "easeInOutBack";

export type Ease = EaseName | EasingFn;

/** Playback state of a single animation. */
export type PlayState = "running" | "finished" | "cancelled";

/**
 * Handle returned by `animate()`.
 * - `finished` resolves on natural completion (not on cancel)
 * - `cancel()` stops mid-flight and leaves the current value
 * - `complete()` jumps to the end value and finishes
 */
export interface AnimationPlayback {
  readonly playState: PlayState;
  readonly finished: Promise<void>;
  cancel(): void;
  complete(): void;
}

/** Duration-based tween options. */
export interface TweenOptions {
  type?: "tween";
  /** Duration in milliseconds. Default: 300. */
  duration?: number;
  /** Delay before starting, in ms. Default: 0. */
  delay?: number;
  /** Easing curve. Default: "easeOut". */
  ease?: Ease;
  /** Override the starting value (defaults to `target.peek()`). */
  from?: number;
  /**
   * Honor `prefers-reduced-motion` (jump to end).
   * Default: true.
   */
  respectReducedMotion?: boolean;
  onUpdate?: (value: number) => void;
  onComplete?: () => void;
  onCancel?: () => void;
}

/** Spring physics options. */
export interface SpringOptions {
  type: "spring";
  stiffness?: number;
  damping?: number;
  mass?: number;
  /** Initial velocity (units per second). */
  velocity?: number;
  /** Settle threshold for position. */
  restDelta?: number;
  /** Settle threshold for velocity. */
  restSpeed?: number;
  delay?: number;
  from?: number;
  respectReducedMotion?: boolean;
  onUpdate?: (value: number) => void;
  onComplete?: () => void;
  onCancel?: () => void;
}

export type AnimateOptions = TweenOptions | SpringOptions;

/** Anything we can animate — a writable number signal. */
export type Animatable = Signal<number>;

/** @internal Driver for time + frames (swappable in tests). */
export interface FrameDriver {
  now(): number;
  raf(cb: (time: number) => void): number;
  caf(id: number): void;
}
