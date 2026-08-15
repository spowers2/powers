import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  signal,
  resource,
  effect,
  createRoot,
  flush,
} from "./index.js";

function delay(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

describe("resource", () => {
  it("fetches once with fetcher-only form", async () => {
    const r = resource(async () => {
      await delay(5);
      return 42;
    });

    assert.equal(r(), undefined);
    assert.equal(r.loading(), true);
    assert.equal(r.state(), "pending");

    await delay(20);
    assert.equal(r(), 42);
    assert.equal(r.loading(), false);
    assert.equal(r.state(), "ready");
    assert.equal(r.latest(), 42);
  });

  it("supports initialValue", async () => {
    const r = resource(async () => 1, { initialValue: 0 });
    assert.equal(r(), 0);
    assert.equal(r.loading(), true);
    await delay(5);
    assert.equal(r(), 1);
  });

  it("re-fetches when source changes", async () => {
    const id = signal(1);
    const seen: number[] = [];

    const r = resource(
      () => id(),
      async (id) => {
        seen.push(id);
        await delay(5);
        return id * 10;
      },
    );

    await delay(15);
    assert.equal(r(), 10);
    assert.deepEqual(seen, [1]);

    id.set(2);
    await delay(15);
    assert.equal(r(), 20);
    assert.deepEqual(seen, [1, 2]);
  });

  it("keeps latest during refetch", async () => {
    let resolve!: (n: number) => void;
    let call = 0;

    const r = resource(
      () =>
        new Promise<number>((res) => {
          call++;
          if (call === 1) res(1);
          else resolve = res;
        }),
    );

    await delay(5);
    assert.equal(r(), 1);
    assert.equal(r.latest(), 1);

    r.refetch();
    // let effect run
    await delay(5);
    assert.equal(r.loading(), true);
    assert.equal(r(), 1); // still previous data until settle
    assert.equal(r.latest(), 1);

    resolve(2);
    await delay(5);
    assert.equal(r(), 2);
    assert.equal(r.loading(), false);
  });

  it("surfaces fetcher errors", async () => {
    const r = resource(async () => {
      throw new Error("nope");
    });
    await delay(5);
    assert.equal(r.state(), "errored");
    assert.ok(r.error() instanceof Error);
    assert.equal(r.loading(), false);
  });

  it("skips when source is nullish or false", async () => {
    const id = signal<number | null>(null);
    let calls = 0;
    const r = resource(
      () => id(),
      async (id) => {
        calls++;
        return id * 2;
      },
    );
    await delay(5);
    assert.equal(calls, 0);
    assert.equal(r.loading(), false);

    id.set(3);
    await delay(5);
    assert.equal(calls, 1);
    assert.equal(r(), 6);
  });

  it("ignores stale responses after dispose", async () => {
    let resolve!: (n: number) => void;
    let disposeRoot!: () => void;

    createRoot((dispose) => {
      disposeRoot = dispose;
      resource(
        () =>
          new Promise<number>((res) => {
            resolve = res;
          }),
      );
    });

    disposeRoot();
    resolve(99);
    await delay(5);
    // no throw; stale settle no-ops
  });

  it("sync fetcher works", async () => {
    const r = resource(() => 7);
    flush();
    assert.equal(r(), 7);
    assert.equal(r.loading(), false);
  });
});

describe("resource + effect", () => {
  it("effects track resource data", async () => {
    const seen: Array<number | undefined> = [];
    const r = resource(async () => {
      await delay(5);
      return 5;
    });

    effect(() => {
      seen.push(r());
    });

    assert.deepEqual(seen, [undefined]);
    await delay(15);
    assert.ok(seen.includes(5));
  });
});

describe("createQuery", () => {
  it("fetches when queryKey is set and refetches on key change", async () => {
    const { createQuery, signal } = await import("./index.js");
    const q = signal("a");
    let calls = 0;
    const art = createQuery({
      queryKey: () => q(),
      queryFn: async (key) => {
        calls++;
        await delay(5);
        return { key, n: calls };
      },
    });

    assert.equal(art.loading(), true);
    await delay(20);
    assert.equal(art()?.key, "a");
    assert.equal(calls, 1);

    q.set("b");
    flush();
    await delay(20);
    assert.equal(art()?.key, "b");
    assert.equal(calls, 2);
  });

  it("stays idle when queryKey is false", async () => {
    const { createQuery, signal } = await import("./index.js");
    const on = signal(false);
    let calls = 0;
    const r = createQuery({
      queryKey: () => (on() ? "x" : false),
      queryFn: async () => {
        calls++;
        return 1;
      },
    });
    await delay(15);
    assert.equal(calls, 0);
    assert.equal(r.loading(), false);

    on.set(true);
    flush();
    await delay(15);
    assert.equal(calls, 1);
    assert.equal(r(), 1);
  });
});
