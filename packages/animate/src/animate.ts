import type { Signal } from "@power-ui/core";
import { driver } from "./driver.js";
import { resolveEase } from "./easings.js";
import { createPlayback } from "./playback.js";
import { prefersReducedMotion } from "./reduced-motion.js";
import { clearActive, getActive, setActive } from "./registry.js";
import type {
  AnimateOptions,
  AnimationPlayback,
  SpringOptions,
  TweenOptions,
} from "./types.js";

const DEFAULT_DURATION = 300;
const DEFAULT_STIFFNESS = 170;
const DEFAULT_DAMPING = 26;
const DEFAULT_MASS = 1;
const DEFAULT_REST_DELTA = 0.1;
const DEFAULT_REST_SPEED = 0.01;

/**
 * Create spring options for `animate()`.
 *
 * @example
 * ```ts
 * animate(x, 100, spring({ stiffness: 200, damping: 20 }));
 * ```
 */
export function spring(
  options: Omit<SpringOptions, "type"> = {},
): SpringOptions {
  return { type: "spring", ...options };
}

/**
 * Animate a number `signal` to a target value.
 *
 * - **Tween (default):** duration + easing
 * - **Spring:** pass `spring({ ... })` or `{ type: "spring", ... }`
 * - **Interruptible:** calling `animate` again on the same signal cancels the prior run
 * - **A11y:** honors `prefers-reduced-motion` (jumps to end) unless opted out
 *
 * @example
 * ```ts
 * const x = signal(0);
 * const anim = animate(x, 100, { duration: 300, ease: "easeOut" });
 * await anim.finished;
 * ```
 */
export function animate(
  target: Signal<number>,
  to: number,
  options: AnimateOptions = {},
): AnimationPlayback {
  // Interrupt any prior animation on this signal.
  getActive(target)?.cancel();

  const isSpring = options.type === "spring";
  const respect =
    options.respectReducedMotion !== false && prefersReducedMotion();
  const from =
    options.from !== undefined ? options.from : target.peek();

  let frameId: number | null = null;

  const stopFrames = () => {
    if (frameId !== null) {
      driver.caf(frameId);
      frameId = null;
    }
  };

  const apply = (value: number) => {
    target.set(value);
    options.onUpdate?.(value);
  };

  let finishedCleanup = false;
  const finishClean = () => {
    if (finishedCleanup) return;
    finishedCleanup = true;
    stopFrames();
    clearActive(target, playback);
  };

  const playback = createPlayback({
    onCancel: () => {
      finishClean();
      options.onCancel?.();
    },
    onComplete: () => {
      apply(to);
      finishClean();
      options.onComplete?.();
    },
  });

  setActive(target, playback);

  // Already there, or reduced motion → snap finish.
  if (respect || Object.is(from, to)) {
    apply(to);
    finishClean();
    options.onComplete?.();
    playback._resolveFinished();
    return playback;
  }

  const delay = options.delay ?? 0;
  const startAt = driver.now() + delay;

  const schedule = (cb: () => void) => {
    frameId = driver.raf(() => {
      frameId = null;
      if (playback.playState !== "running") return;
      cb();
    });
  };

  const begin = () => {
    if (playback.playState !== "running") return;
    if (isSpring) {
      startSpring(
        from,
        to,
        options as SpringOptions,
        playback,
        apply,
        schedule,
        () => {
          finishClean();
          options.onComplete?.();
          playback._resolveFinished();
        },
      );
    } else {
      startTween(
        from,
        to,
        options as TweenOptions,
        playback,
        apply,
        schedule,
        () => {
          finishClean();
          options.onComplete?.();
          playback._resolveFinished();
        },
      );
    }
  };

  if (delay > 0) {
    const wait = () => {
      if (playback.playState !== "running") return;
      if (driver.now() < startAt) {
        schedule(wait);
        return;
      }
      begin();
    };
    schedule(wait);
  } else {
    begin();
  }

  return playback;
}

function startTween(
  from: number,
  to: number,
  options: TweenOptions,
  playback: AnimationPlayback,
  apply: (v: number) => void,
  schedule: (cb: () => void) => void,
  onDone: () => void,
): void {
  const duration = Math.max(0, options.duration ?? DEFAULT_DURATION);
  const ease = resolveEase(options.ease ?? "easeOut");
  const start = driver.now();

  if (duration === 0) {
    apply(to);
    onDone();
    return;
  }

  const tick = () => {
    if (playback.playState !== "running") return;

    const elapsed = driver.now() - start;
    const t = Math.min(1, elapsed / duration);
    apply(from + (to - from) * ease(t));

    if (t >= 1) {
      apply(to);
      onDone();
      return;
    }
    schedule(tick);
  };

  schedule(tick);
}

function startSpring(
  from: number,
  to: number,
  options: SpringOptions,
  playback: AnimationPlayback,
  apply: (v: number) => void,
  schedule: (cb: () => void) => void,
  onDone: () => void,
): void {
  const stiffness = options.stiffness ?? DEFAULT_STIFFNESS;
  const damping = options.damping ?? DEFAULT_DAMPING;
  const mass = options.mass ?? DEFAULT_MASS;
  const restDelta = options.restDelta ?? DEFAULT_REST_DELTA;
  const restSpeed = options.restSpeed ?? DEFAULT_REST_SPEED;

  let current = from;
  let velocity = options.velocity ?? 0;
  let last = driver.now();

  apply(current);

  const tick = () => {
    if (playback.playState !== "running") return;

    const now = driver.now();
    const dt = Math.min(0.064, Math.max(0.001, (now - last) / 1000));
    last = now;

    const springForce = -stiffness * (current - to);
    const damperForce = -damping * velocity;
    const acceleration = (springForce + damperForce) / mass;
    velocity += acceleration * dt;
    current += velocity * dt;

    apply(current);

    if (
      Math.abs(velocity) <= restSpeed &&
      Math.abs(current - to) <= restDelta
    ) {
      apply(to);
      onDone();
      return;
    }

    schedule(tick);
  };

  schedule(tick);
}
