import { describe, it, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { signal } from "@lab206/core";
import { createGsapBridge, type GsapLike } from "./gsap-bridge.js";
import { setReducedMotionOverride } from "./reduced-motion.js";
import { cancel } from "./registry.js";

function mockGsap(): GsapLike & {
  lastVars: Record<string, unknown> | null;
  killed: boolean;
} {
  const api = {
    lastVars: null as Record<string, unknown> | null,
    killed: false,
    to(target: object, vars: Record<string, unknown>) {
      api.lastVars = vars;
      // Simulate progressive update then complete
      const proxy = target as { v: number };
      const to = vars.v as number;
      proxy.v = (proxy.v + to) / 2;
      (vars.onUpdate as (() => void) | undefined)?.();
      proxy.v = to;
      (vars.onUpdate as (() => void) | undefined)?.();
      (vars.onComplete as (() => void) | undefined)?.();
      return {
        kill: () => {
          api.killed = true;
        },
      };
    },
  };
  return api;
}

describe("createGsapBridge", () => {
  beforeEach(() => {
    setReducedMotionOverride(false);
  });
  afterEach(() => {
    setReducedMotionOverride(null);
  });

  it("tweens a signal to the target via GSAP", async () => {
    const gsap = mockGsap();
    const { gsapAnimate } = createGsapBridge(gsap);
    const x = signal(0);
    let completed = false;
    const anim = gsapAnimate(x, 100, {
      duration: 200,
      ease: "power2.out",
      onComplete: () => {
        completed = true;
      },
    });
    await Promise.resolve();
    assert.equal(x(), 100);
    assert.equal(anim.playState, "finished");
    assert.equal(completed, true);
    assert.equal(gsap.lastVars?.ease, "power2.out");
    // duration converted to seconds
    assert.equal(gsap.lastVars?.duration, 0.2);
  });

  it("gsapFromTo starts from explicit value", async () => {
    const gsap = mockGsap();
    const { gsapFromTo } = createGsapBridge(gsap);
    const x = signal(50);
    const anim = gsapFromTo(x, 10, 90, { duration: 100 });
    await Promise.resolve();
    assert.equal(x(), 90);
    assert.equal(anim.playState, "finished");
  });

  it("reduced motion snaps to end", () => {
    setReducedMotionOverride(true);
    const gsap = mockGsap();
    const { gsapAnimate } = createGsapBridge(gsap);
    const x = signal(0);
    const anim = gsapAnimate(x, 40, { duration: 1000 });
    assert.equal(x(), 40);
    assert.equal(anim.playState, "finished");
    assert.equal(gsap.lastVars, null); // never called gsap.to
  });

  it("cancel kills the tween and leaves mid value when mocked mid-flight", () => {
    const gsap: GsapLike & { killed: boolean } = {
      killed: false,
      to(target, vars) {
        const proxy = target as { v: number };
        proxy.v = 40;
        (vars.onUpdate as (() => void) | undefined)?.();
        // do not complete
        return {
          kill: () => {
            gsap.killed = true;
          },
        };
      },
    };
    const { gsapAnimate } = createGsapBridge(gsap);
    const x = signal(0);
    const anim = gsapAnimate(x, 100, { duration: 500 });
    assert.equal(x(), 40);
    assert.equal(anim.playState, "running");
    anim.cancel();
    assert.equal(anim.playState, "cancelled");
    assert.equal(gsap.killed, true);
    assert.equal(x(), 40);
  });

  it("new animate cancels previous on same signal", () => {
    let kills = 0;
    const gsap: GsapLike = {
      to(_t, vars) {
        return {
          kill: () => {
            kills++;
          },
        };
        // never complete first
        void vars;
      },
    };
    const { gsapAnimate } = createGsapBridge(gsap);
    const x = signal(0);
    gsapAnimate(x, 100, { duration: 1000 });
    gsapAnimate(x, 50, { duration: 100 });
    assert.ok(kills >= 1);
  });

  it("cancel() helper stops gsap-driven animation", () => {
    const gsap: GsapLike & { killed: boolean } = {
      killed: false,
      to() {
        return {
          kill: () => {
            gsap.killed = true;
          },
        };
      },
    };
    const { gsapAnimate } = createGsapBridge(gsap);
    const x = signal(0);
    gsapAnimate(x, 100, { duration: 999 });
    cancel(x);
    assert.equal(gsap.killed, true);
  });
});
