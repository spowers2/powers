/**
 * GSAP ↔ Powers signal bridge (no hard dependency on `gsap`).
 * Use `createGsapBridge(gsap)` or the default export from `@lab206/animate/gsap`.
 */
import type { Signal } from "@lab206/core";
import { createPlayback } from "./playback.js";
import { clearActive, getActive, setActive } from "./registry.js";
import { prefersReducedMotion } from "./reduced-motion.js";
import type { AnimationPlayback } from "./types.js";

/** Minimal tween handle — real GSAP Tween.kill has a wider signature. */
export type GsapTweenLike = {
  kill: (...args: unknown[]) => unknown;
};

/** Minimal GSAP surface we need — keeps peer types loose. */
export type GsapLike = {
  to(target: object, vars: Record<string, unknown>): GsapTweenLike;
  fromTo?(
    target: object,
    fromVars: Record<string, unknown>,
    toVars: Record<string, unknown>,
  ): GsapTweenLike;
};

export type GsapAnimateOptions = {
  /**
   * Duration in **milliseconds** (same unit as `animate()`).
   * Converted to seconds for GSAP. Default: 300.
   */
  duration?: number;
  /** Delay in milliseconds. Default: 0. */
  delay?: number;
  /** GSAP ease string, e.g. `"power2.out"`, `"elastic.out(1, 0.4)"`. */
  ease?: string;
  /** Override start value (defaults to `target.peek()`). */
  from?: number;
  /**
   * Honor `prefers-reduced-motion` (jump to end). Default: true.
   */
  respectReducedMotion?: boolean;
  /**
   * Extra GSAP tween vars (overwrite, yoyo, repeat, stagger on multi-targets, …).
   * Do not set `onUpdate` / `onComplete` here — use the callbacks below.
   */
  vars?: Record<string, unknown>;
  onUpdate?: (value: number) => void;
  onComplete?: () => void;
  onCancel?: () => void;
};

export type GsapBridge = {
  /**
   * Animate a number signal with GSAP.
   * Same interrupt model as `animate()`: a new call cancels the previous on that signal.
   */
  gsapAnimate: (
    target: Signal<number>,
    to: number,
    options?: GsapAnimateOptions,
  ) => AnimationPlayback;
  /**
   * Explicit from → to with GSAP (`fromTo`).
   */
  gsapFromTo: (
    target: Signal<number>,
    from: number,
    to: number,
    options?: GsapAnimateOptions,
  ) => AnimationPlayback;
};

/**
 * Bind a GSAP instance (or mock) to Powers signals.
 *
 * @example
 * ```ts
 * import gsap from "gsap";
 * import { createGsapBridge } from "@lab206/animate/gsap";
 *
 * const { gsapAnimate } = createGsapBridge(gsap);
 * gsapAnimate(x, 100, { duration: 400, ease: "power3.out" });
 * ```
 */
export function createGsapBridge(gsap: GsapLike): GsapBridge {
  function run(
    target: Signal<number>,
    from: number,
    to: number,
    options: GsapAnimateOptions,
  ): AnimationPlayback {
    getActive(target)?.cancel();

    const respect =
      options.respectReducedMotion !== false && prefersReducedMotion();

    let tween: GsapTweenLike | null = null;
    let finishedCleanup = false;

    const finishClean = () => {
      if (finishedCleanup) return;
      finishedCleanup = true;
      clearActive(target, playback);
    };

    const apply = (value: number) => {
      target.set(value);
      options.onUpdate?.(value);
    };

    const playback = createPlayback({
      onCancel: () => {
        tween?.kill();
        tween = null;
        finishClean();
        options.onCancel?.();
      },
      onComplete: () => {
        apply(to);
        tween = null;
        finishClean();
        options.onComplete?.();
      },
    });

    setActive(target, playback);

    if (respect || from === to) {
      apply(to);
      playback.complete();
      return playback;
    }

    const proxy = { v: from };
    apply(from);

    const durationSec = Math.max(0, (options.duration ?? 300) / 1000);
    const delaySec = Math.max(0, (options.delay ?? 0) / 1000);
    // Strip reserved keys so callers cannot clobber signal wiring
    const extra = { ...(options.vars ?? {}) };
    delete extra.v;
    delete extra.onUpdate;
    delete extra.onComplete;
    delete extra.onInterrupt;
    delete extra.duration;
    delete extra.delay;
    delete extra.ease;

    const toVars: Record<string, unknown> = {
      ...extra,
      v: to,
      duration: durationSec,
      delay: delaySec,
      ease: options.ease ?? "power2.out",
      onUpdate: () => {
        apply(proxy.v);
      },
      onComplete: () => {
        if (playback.playState !== "running") return;
        playback.complete();
      },
    };

    if (typeof gsap.fromTo === "function") {
      tween = gsap.fromTo(proxy, { v: from }, toVars);
    } else {
      tween = gsap.to(proxy, toVars);
    }

    return playback;
  }

  return {
    gsapAnimate(target, to, options = {}) {
      const from =
        options.from !== undefined ? options.from : target.peek();
      return run(target, from, to, options);
    },
    gsapFromTo(target, from, to, options = {}) {
      return run(target, from, to, { ...options, from });
    },
  };
}
