import { describe, it, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { signal } from "@lab206/core";
import {
  animate,
  spring,
  cancel,
  createTestClock,
  installDriver,
  setReducedMotionOverride,
  resolveEase,
} from "./index.js";

describe("@lab206/animate", () => {
  let restore: (() => void) | undefined;
  let clock: ReturnType<typeof createTestClock>;

  beforeEach(() => {
    clock = createTestClock();
    restore = installDriver(clock.driver);
    setReducedMotionOverride(false);
  });

  afterEach(() => {
    setReducedMotionOverride(null);
    restore?.();
  });

  it("tweens a signal to the target", () => {
    const x = signal(0);
    const anim = animate(x, 100, { duration: 100, ease: "linear" });

    clock.advance(50);
    assert.ok(x() > 40 && x() < 60, `mid ~50, got ${x()}`);
    assert.equal(anim.playState, "running");

    clock.advance(50);
    assert.equal(x(), 100);
    assert.equal(anim.playState, "finished");
  });

  it("resolves finished on completion", async () => {
    const x = signal(0);
    const anim = animate(x, 10, { duration: 30, ease: "linear" });
    let done = false;
    void anim.finished.then(() => {
      done = true;
    });

    clock.advance(30);
    // microtask for promise
    await Promise.resolve();
    assert.equal(done, true);
    assert.equal(x(), 10);
  });

  it("cancel leaves value mid-flight and does not finish", async () => {
    const x = signal(0);
    let completed = false;
    let cancelled = false;
    const anim = animate(x, 100, {
      duration: 100,
      ease: "linear",
      onComplete: () => {
        completed = true;
      },
      onCancel: () => {
        cancelled = true;
      },
    });

    clock.advance(40);
    const mid = x();
    anim.cancel();
    assert.equal(anim.playState, "cancelled");
    assert.equal(cancelled, true);
    assert.equal(completed, false);
    assert.equal(x(), mid);

    clock.advance(100);
    assert.equal(x(), mid);
  });

  it("complete() jumps to end", () => {
    const x = signal(0);
    let completed = false;
    const anim = animate(x, 100, {
      duration: 500,
      onComplete: () => {
        completed = true;
      },
    });
    clock.advance(16);
    anim.complete();
    assert.equal(x(), 100);
    assert.equal(anim.playState, "finished");
    assert.equal(completed, true);
  });

  it("interrupts previous animation on same signal", () => {
    const x = signal(0);
    let firstCancel = 0;
    const a = animate(x, 100, {
      duration: 200,
      ease: "linear",
      onCancel: () => {
        firstCancel++;
      },
    });
    clock.advance(40);
    const b = animate(x, 0, { duration: 100, ease: "linear" });
    assert.equal(a.playState, "cancelled");
    assert.equal(firstCancel, 1);
    clock.advance(100);
    assert.equal(b.playState, "finished");
    assert.equal(x(), 0);
  });

  it("cancel(target) helper works", () => {
    const x = signal(0);
    animate(x, 100, { duration: 200 });
    clock.advance(20);
    cancel(x);
    const mid = x();
    clock.advance(200);
    assert.equal(x(), mid);
  });

  it("respects reduced motion by snapping", () => {
    setReducedMotionOverride(true);
    const x = signal(0);
    let frames = 0;
    const anim = animate(x, 50, {
      duration: 400,
      onUpdate: () => {
        frames++;
      },
    });
    assert.equal(x(), 50);
    assert.equal(anim.playState, "finished");
    // single snap update
    assert.ok(frames <= 1);
  });

  it("can opt out of reduced motion", () => {
    setReducedMotionOverride(true);
    const x = signal(0);
    animate(x, 100, {
      duration: 100,
      ease: "linear",
      respectReducedMotion: false,
    });
    clock.advance(50);
    assert.ok(x() > 0 && x() < 100);
    clock.advance(50);
    assert.equal(x(), 100);
  });

  it("supports from override", () => {
    const x = signal(0);
    animate(x, 100, { duration: 100, ease: "linear", from: 50 });
    // first frame may be scheduled; advance a tiny bit
    clock.advance(0.1);
    clock.advance(50);
    assert.ok(x() >= 70 && x() <= 85, `expected ~75, got ${x()}`);
  });

  it("spring settles near target", () => {
    const x = signal(0);
    const anim = animate(x, 100, spring({ stiffness: 300, damping: 30 }));
    // Advance enough simulated time for the spring to settle.
    for (let i = 0; i < 120; i++) clock.advance(16);
    assert.equal(anim.playState, "finished");
    assert.equal(x(), 100);
  });

  it("delay defers motion", () => {
    const x = signal(0);
    animate(x, 100, { duration: 50, delay: 50, ease: "linear" });
    clock.advance(40);
    assert.equal(x(), 0);
    clock.advance(60);
    assert.ok(x() > 0);
    clock.advance(50);
    assert.equal(x(), 100);
  });

  it("resolveEase supports custom functions", () => {
    const ease = resolveEase((t) => t * t);
    assert.equal(ease(0.5), 0.25);
  });

  it("onUpdate fires during tween", () => {
    const x = signal(0);
    const values: number[] = [];
    animate(x, 10, {
      duration: 40,
      ease: "linear",
      onUpdate: (v) => values.push(v),
    });
    clock.advance(40);
    assert.ok(values.length >= 2);
    assert.equal(values[values.length - 1], 10);
  });
});
