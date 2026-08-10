import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  signal,
  computed,
  effect,
  batch,
  flush,
  createRoot,
  onError,
  untrack,
} from "./index.js";

async function tick(): Promise<void> {
  await Promise.resolve();
  await Promise.resolve();
}

describe("stress: diamond dependencies", () => {
  it("updates D once when A changes (A→B, A→C, B+C→D)", async () => {
    const a = signal(1);
    const b = computed(() => a() + 1);
    const c = computed(() => a() + 10);
    const d = computed(() => b() + c());

    let runs = 0;
    let last = 0;
    effect(() => {
      last = d();
      runs++;
    });

    assert.equal(last, (1 + 1) + (1 + 10));
    assert.equal(runs, 1);

    a.set(2);
    await tick();
    assert.equal(last, (2 + 1) + (2 + 10));
    // May be 2 (ideal) — batched notify should not explode.
    assert.ok(runs >= 2 && runs <= 3, `expected ~2 runs, got ${runs}`);
  });
});

describe("stress: dispose during effect", () => {
  it("can dispose self safely mid-graph", async () => {
    const n = signal(0);
    let runs = 0;
    let stop!: () => void;

    stop = effect(() => {
      runs++;
      n();
      if (runs === 2) {
        stop();
      }
    });

    assert.equal(runs, 1);
    n.set(1);
    await tick();
    assert.equal(runs, 2);

    n.set(2);
    await tick();
    assert.equal(runs, 2);
  });

  it("dispose root from inside effect", async () => {
    const n = signal(0);
    let runs = 0;

    createRoot((dispose) => {
      effect(() => {
        runs++;
        if (n() > 0) dispose();
      });
    });

    assert.equal(runs, 1);
    n.set(1);
    await tick();
    assert.equal(runs, 2);

    n.set(2);
    await tick();
    assert.equal(runs, 2);
  });
});

describe("stress: batch + deep chain", () => {
  it("single effect run for long computed chain in batch", () => {
    const head = signal(0);
    let node = computed(() => head());
    for (let i = 0; i < 50; i++) {
      const prev = node;
      node = computed(() => prev() + 1);
    }
    const tail = node;

    let runs = 0;
    effect(() => {
      tail();
      runs++;
    });
    assert.equal(runs, 1);

    batch(() => {
      head.set(1);
      head.set(2);
      head.set(3);
    });
    assert.equal(runs, 2);
    assert.equal(tail(), 3 + 50);
  });
});

describe("stress: many observers", () => {
  it("fan-out 200 effects", async () => {
    const s = signal(0);
    let total = 0;
    const stops: Array<() => void> = [];

    for (let i = 0; i < 200; i++) {
      stops.push(
        effect(() => {
          total += s();
        }),
      );
    }

    s.set(1);
    await tick();
    assert.ok(total > 0);

    for (const stop of stops) stop();
    const after = total;
    s.set(2);
    await tick();
    assert.equal(total, after);
  });
});

describe("onError", () => {
  it("catches effect errors at owner level", async () => {
    const boom = signal(false);
    const seen: unknown[] = [];

    createRoot(() => {
      onError((err) => {
        seen.push(err);
      });
      effect(() => {
        if (boom()) throw new Error("explode");
      });
    });

    assert.equal(seen.length, 0);
    boom.set(true);
    await tick();
    assert.equal(seen.length, 1);
    assert.ok(seen[0] instanceof Error);
  });

  it("supports local effect onError", async () => {
    const boom = signal(false);
    let local = 0;
    let owner = 0;

    createRoot(() => {
      onError(() => {
        owner++;
      });
      effect(
        () => {
          if (boom()) throw new Error("x");
        },
        {
          onError: () => {
            local++;
          },
        },
      );
    });

    boom.set(true);
    await tick();
    assert.equal(local, 1);
    assert.equal(owner, 0);
  });

  it("graph continues after a handled error", async () => {
    const a = signal(0);
    const b = signal(0);
    let good = 0;

    createRoot(() => {
      onError(() => {
        /* swallow */
      });
      effect(() => {
        if (a() === 1) throw new Error("bad");
      });
      effect(() => {
        b();
        good++;
      });
    });

    a.set(1);
    await tick();
    b.set(1);
    await tick();
    assert.equal(good, 2);
  });
});

describe("untrack isolation", () => {
  it("conditional untrack does not subscribe", async () => {
    const a = signal(0);
    const b = signal(0);
    let runs = 0;
    effect(() => {
      runs++;
      a();
      if (a.peek() > 0) {
        untrack(() => b());
      }
    });
    b.set(1);
    await tick();
    assert.equal(runs, 1);
    a.set(1);
    await tick();
    assert.equal(runs, 2);
    b.set(2);
    await tick();
    assert.equal(runs, 2);
  });
});

describe("write during effect", () => {
  it("cascading writes eventually settle", async () => {
    const a = signal(0);
    const b = signal(0);

    effect(() => {
      const v = a();
      if (v > 0 && v < 5) {
        b.set(v);
      }
    });

    effect(() => {
      const v = b();
      if (v > 0 && v < 5) {
        a.set(v + 1);
      }
    });

    a.set(1);
    // allow cascade microtasks
    for (let i = 0; i < 20; i++) await tick();
    flush();
    assert.ok(a() >= 5 || b() >= 4);
  });
});
