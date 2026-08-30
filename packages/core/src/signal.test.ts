import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import {
  signal,
  computed,
  effect,
  batch,
  flush,
  createRoot,
  untrack,
  isolateTracking,
} from "./index.js";

// node:test runs files as ESM; give microtasks a tick when needed
async function tick(): Promise<void> {
  await Promise.resolve();
  await Promise.resolve();
}

describe("signal", () => {
  it("reads initial value", () => {
    const count = signal(0);
    assert.equal(count(), 0);
    assert.equal(count.peek(), 0);
  });

  it("updates via set and update", () => {
    const count = signal(0);
    count.set(2);
    assert.equal(count(), 2);
    count.update((n) => n + 3);
    assert.equal(count(), 5);
  });

  it("skips notify when equals says unchanged", async () => {
    const count = signal(1);
    let runs = 0;
    effect(() => {
      count();
      runs++;
    });
    assert.equal(runs, 1);
    count.set(1);
    await tick();
    assert.equal(runs, 1);
  });

  it("supports custom equals", async () => {
    const point = signal(
      { x: 0, y: 0 },
      { equals: (a, b) => a.x === b.x && a.y === b.y },
    );
    let runs = 0;
    effect(() => {
      point();
      runs++;
    });
    point.set({ x: 0, y: 0 });
    await tick();
    assert.equal(runs, 1);
    point.set({ x: 1, y: 0 });
    await tick();
    assert.equal(runs, 2);
  });
});

describe("computed", () => {
  it("derives from signals", () => {
    const a = signal(2);
    const b = signal(3);
    const sum = computed(() => a() + b());
    assert.equal(sum(), 5);
    a.set(10);
    assert.equal(sum(), 13);
  });

  it("chains computeds", () => {
    const n = signal(2);
    const double = computed(() => n() * 2);
    const quad = computed(() => double() * 2);
    assert.equal(quad(), 8);
    n.set(3);
    assert.equal(quad(), 12);
  });

  it("is lazy until read", async () => {
    const n = signal(1);
    let computes = 0;
    const c = computed(() => {
      computes++;
      return n() * 2;
    });
    assert.equal(computes, 0);
    assert.equal(c(), 2);
    assert.equal(computes, 1);
    // No readers re-trigger until dirty + read
    n.set(2);
    assert.equal(computes, 1);
    assert.equal(c(), 4);
    assert.equal(computes, 2);
  });
});

describe("effect", () => {
  it("runs immediately and on change", async () => {
    const n = signal(0);
    const seen: number[] = [];
    effect(() => {
      seen.push(n());
    });
    assert.deepEqual(seen, [0]);
    n.set(1);
    await tick();
    assert.deepEqual(seen, [0, 1]);
  });

  it("runs cleanup before re-run and on dispose", async () => {
    const n = signal(0);
    const events: string[] = [];
    const stop = effect(() => {
      n();
      events.push("run");
      return () => events.push("cleanup");
    });
    assert.deepEqual(events, ["run"]);
    n.set(1);
    await tick();
    assert.deepEqual(events, ["run", "cleanup", "run"]);
    stop();
    assert.deepEqual(events, ["run", "cleanup", "run", "cleanup"]);
    n.set(2);
    await tick();
    assert.deepEqual(events, ["run", "cleanup", "run", "cleanup"]);
  });

  it("does not track peek or untrack", async () => {
    const a = signal(0);
    const b = signal(0);
    let runs = 0;
    effect(() => {
      runs++;
      a();
      b.peek();
      untrack(() => b());
    });
    assert.equal(runs, 1);
    b.set(1);
    await tick();
    assert.equal(runs, 1);
    a.set(1);
    await tick();
    assert.equal(runs, 2);
  });
});

describe("batch", () => {
  it("coalesces multiple writes into one effect run", async () => {
    const a = signal(0);
    const b = signal(0);
    let runs = 0;
    effect(() => {
      a();
      b();
      runs++;
    });
    assert.equal(runs, 1);
    batch(() => {
      a.set(1);
      b.set(2);
    });
    // batch flushes synchronously at end
    assert.equal(runs, 2);
    assert.equal(a() + b(), 3);
  });

  it("nests batches", () => {
    const a = signal(0);
    let runs = 0;
    effect(() => {
      a();
      runs++;
    });
    batch(() => {
      a.set(1);
      batch(() => {
        a.set(2);
      });
      a.set(3);
    });
    assert.equal(runs, 2);
    assert.equal(a(), 3);
  });
});

describe("createRoot", () => {
  it("disposes owned effects", async () => {
    const n = signal(0);
    let runs = 0;
    let disposeRoot!: () => void;

    createRoot((dispose) => {
      disposeRoot = dispose;
      effect(() => {
        n();
        runs++;
      });
    });

    assert.equal(runs, 1);
    n.set(1);
    await tick();
    assert.equal(runs, 2);

    disposeRoot();
    n.set(2);
    await tick();
    assert.equal(runs, 2);
  });

  it("does not let parent effects track signals read during root setup", async () => {
    // Regression: router outlet effect was re-running (remounting the page)
    // when form signals updated, because Input setup read value={email}
    // while the outlet effect was still the active tracking node.
    const email = signal("");
    let parentRuns = 0;
    let childReads = 0;

    effect(() => {
      parentRuns++;
      createRoot(() => {
        // Simulate component setup reading a signal (like props.value unwrap)
        email();
        childReads++;
      });
    });

    assert.equal(parentRuns, 1);
    assert.equal(childReads, 1);

    email.set("a");
    await tick();
    // Parent must NOT re-run — only the root's own effects would.
    assert.equal(parentRuns, 1);
    assert.equal(childReads, 1);
  });

  it("effects created inside createRoot still track their sources", async () => {
    const n = signal(0);
    let runs = 0;
    createRoot(() => {
      effect(() => {
        n();
        runs++;
      });
    });
    assert.equal(runs, 1);
    n.set(1);
    await tick();
    assert.equal(runs, 2);
  });

  it("isolateTracking blocks parent consumer but nested effects still track", async () => {
    const a = signal(0);
    const b = signal(0);
    let outerRuns = 0;
    let innerRuns = 0;

    effect(() => {
      outerRuns++;
      isolateTracking(() => {
        a(); // must not subscribe outer
        effect(() => {
          b();
          innerRuns++;
        });
      });
    });

    assert.equal(outerRuns, 1);
    assert.equal(innerRuns, 1);
    a.set(1);
    await tick();
    assert.equal(outerRuns, 1, "parent must not re-run when setup-only signal changes");
    b.set(1);
    await tick();
    assert.equal(innerRuns, 2, "nested effect must still track");
  });

  it("nested createRoot does not leak tracking to outer root's parent effect", async () => {
    const a = signal(0);
    const b = signal(0);
    let outerRuns = 0;
    let innerSetup = 0;

    effect(() => {
      outerRuns++;
      createRoot(() => {
        createRoot(() => {
          a();
          b();
          innerSetup++;
        });
      });
    });

    assert.equal(outerRuns, 1);
    assert.equal(innerSetup, 1);
    a.set(1);
    await tick();
    b.set(1);
    await tick();
    assert.equal(outerRuns, 1);
    assert.equal(innerSetup, 1);
  });
});

describe("flush", () => {
  beforeEach(() => {
    // ensure clean slate between tests if needed
  });

  it("is safe to call with empty queue", () => {
    flush();
  });
});
