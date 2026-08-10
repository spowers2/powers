import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { store, effect, flush } from "./index.js";

async function tick(): Promise<void> {
  await Promise.resolve();
  await Promise.resolve();
}

describe("store", () => {
  it("reads and writes fields as signals", () => {
    const app = store({ count: 0, name: "Ada" });
    assert.equal(app.count(), 0);
    assert.equal(app.name(), "Ada");
    app.count.set(2);
    app.name.set("Grace");
    assert.equal(app.count(), 2);
    assert.equal(app.name(), "Grace");
  });

  it("snapshot tracks all fields", async () => {
    const app = store({ count: 0, name: "Ada" });
    let runs = 0;
    let last = "";
    effect(() => {
      const s = app();
      last = `${s.count}:${s.name}`;
      runs++;
    });
    assert.equal(runs, 1);
    assert.equal(last, "0:Ada");

    app.count.set(1);
    await tick();
    assert.equal(runs, 2);
    assert.equal(last, "1:Ada");
  });

  it("set batches multiple fields into one effect run", async () => {
    const app = store({ a: 0, b: 0 });
    let runs = 0;
    effect(() => {
      app.a();
      app.b();
      runs++;
    });
    assert.equal(runs, 1);

    app.set({ a: 1, b: 2 });
    assert.equal(runs, 2);
    assert.equal(app.a(), 1);
    assert.equal(app.b(), 2);
  });

  it("replace updates every key", () => {
    const app = store({ a: 1, b: 2 });
    app.replace({ a: 9, b: 8 });
    assert.deepEqual(app.peek(), { a: 9, b: 8 });
  });

  it("field-level effects do not re-run for other fields", async () => {
    const app = store({ a: 0, b: 0 });
    let aRuns = 0;
    let bRuns = 0;
    effect(() => {
      app.a();
      aRuns++;
    });
    effect(() => {
      app.b();
      bRuns++;
    });
    app.a.set(1);
    await tick();
    assert.equal(aRuns, 2);
    assert.equal(bRuns, 1);
  });

  it("update on a field works", () => {
    const app = store({ count: 1 });
    app.count.update((n) => n + 4);
    assert.equal(app.count(), 5);
    flush();
  });
});
