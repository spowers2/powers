import type { FrameDriver } from "./types.js";

function defaultNow(): number {
  return typeof performance !== "undefined" && performance.now
    ? performance.now()
    : Date.now();
}

function defaultRaf(cb: (time: number) => void): number {
  if (typeof requestAnimationFrame === "function") {
    return requestAnimationFrame(cb);
  }
  // Node / SSR fallback ~60fps
  return setTimeout(() => cb(defaultNow()), 1000 / 60) as unknown as number;
}

function defaultCaf(id: number): void {
  if (typeof cancelAnimationFrame === "function") {
    cancelAnimationFrame(id);
    return;
  }
  clearTimeout(id);
}

/** Active frame driver — replace in tests via `installDriver`. */
export let driver: FrameDriver = {
  now: defaultNow,
  raf: defaultRaf,
  caf: defaultCaf,
};

/** Swap the frame driver (used by tests and advanced hosts). */
export function installDriver(next: FrameDriver): () => void {
  const prev = driver;
  driver = next;
  return () => {
    driver = prev;
  };
}

/**
 * Deterministic test clock: manual `advance(ms)` pumps animations.
 *
 * @example
 * ```ts
 * const clock = createTestClock();
 * const restore = installDriver(clock.driver);
 * animate(x, 100, { duration: 100 });
 * clock.advance(50);
 * clock.advance(50);
 * restore();
 * ```
 */
export function createTestClock(): {
  driver: FrameDriver;
  advance: (ms: number) => void;
  readonly time: number;
} {
  let time = 0;
  let nextId = 1;
  type Entry = { id: number; time: number; cb: (t: number) => void };
  let queue: Entry[] = [];

  const clockDriver: FrameDriver = {
    now: () => time,
    raf(cb) {
      const id = nextId++;
      // Schedule for "next frame" — advanced when time moves.
      queue.push({ id, time: time, cb });
      return id;
    },
    caf(id) {
      queue = queue.filter((e) => e.id !== id);
    },
  };

  const advance = (ms: number): void => {
    if (ms < 0) return;
    const target = time + ms;
    // Process frames in small steps so springs/tweens see intermediate times.
    const step = 16.6667;
    while (time < target) {
      const nextTime = Math.min(time + step, target);
      time = nextTime;
      const batch = queue;
      queue = [];
      for (const entry of batch) {
        entry.cb(time);
      }
    }
  };

  return {
    driver: clockDriver,
    advance,
    get time() {
      return time;
    },
  };
}
