/**
 * Phase 1 demo: pure reactivity, no DOM / view layer.
 *
 * Proves signals + computed + effect work as a standalone library.
 */
import {
  signal,
  computed,
  effect,
  batch,
  flush,
  createRoot,
} from "@lab206/core";

createRoot((dispose) => {
  const count = signal(0, { name: "count" });
  const doubled = computed(() => count() * 2, { name: "doubled" });
  const label = computed(
    () => `count=${count()} doubled=${doubled()}`,
    { name: "label" },
  );

  effect(() => {
    console.log(`[effect] ${label()}`);
  });

  console.log("--- single updates (flush so logs appear in order) ---");
  count.set(1);
  flush();
  count.update((n) => n + 1);
  flush();

  console.log("--- batched updates (one effect for three sets) ---");
  batch(() => {
    count.set(10);
    count.set(20);
    count.set(30);
  });

  console.log("--- peek ---");
  console.log(`peek count=${count.peek()} doubled=${doubled.peek()}`);

  console.log("--- dispose root ---");
  dispose();
  count.set(99);
  flush();
  console.log("(no effect after dispose)");
});