/**
 * Micro-benchmarks for @power-ui/core.
 * Not a formal competitor suite yet — establishes a local baseline.
 */
import { signal, computed, effect, batch, createRoot } from "../src/index.js";

function time(label: string, fn: () => void, iterations = 1): number {
  // warmup
  fn();
  const start = performance.now();
  for (let i = 0; i < iterations; i++) fn();
  const ms = performance.now() - start;
  const per = ms / iterations;
  console.log(
    `${label.padEnd(42)} ${ms.toFixed(2).padStart(10)} ms total | ${per.toFixed(4)} ms/iter`,
  );
  return ms;
}

const N = 10_000;

console.log("\n@power-ui/core micro-benchmarks\n");

time("create 10k signals", () => {
  for (let i = 0; i < N; i++) signal(i);
});

time("create 10k computeds (unread)", () => {
  const src = signal(0);
  for (let i = 0; i < N; i++) computed(() => src() + i);
});

time("read 10k signal updates (no observers)", () => {
  const s = signal(0);
  for (let i = 0; i < N; i++) {
    s.set(i);
    s();
  }
});

time("1 signal → 1 computed → 1 effect × 10k", () => {
  createRoot((dispose) => {
    const s = signal(0);
    const c = computed(() => s() * 2);
    effect(() => {
      c();
    });
    for (let i = 0; i < N; i++) {
      s.set(i);
    }
    dispose();
  });
}, 1);

time("batch 10k writes → 1 effect", () => {
  createRoot((dispose) => {
    const s = signal(0);
    effect(() => {
      s();
    });
    batch(() => {
      for (let i = 0; i < N; i++) s.set(i);
    });
    dispose();
  });
}, 1);

time("fan-out: 1 signal → 100 effects × 1k updates", () => {
  createRoot((dispose) => {
    const s = signal(0);
    for (let i = 0; i < 100; i++) {
      effect(() => {
        s();
      });
    }
    for (let i = 0; i < 1000; i++) {
      s.set(i);
    }
    dispose();
  });
}, 1);

console.log("\nDone.\n");
