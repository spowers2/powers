/**
 * Kitchen sink — the whole Phase 1.1 mental model in one script.
 *
 * Learn order:
 *   signal → computed → effect → store → resource
 */
import {
  signal,
  computed,
  effect,
  batch,
  store,
  resource,
  createRoot,
  onError,
  flush,
} from "@lab206/core";

function delay(ms: number, value: string): Promise<string> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

console.log("\n=== Powers kitchen sink ===\n");

createRoot((dispose) => {
  onError((err) => {
    console.log("[onError]", err instanceof Error ? err.message : err);
  });

  // 1) signal + computed + effect
  console.log("--- 1. signal / computed / effect ---");
  const count = signal(0);
  const label = computed(() => `Clicked ${count()} time(s)`);
  effect(() => console.log(" ", label()));

  count.set(1);
  flush();
  count.update((n) => n + 1);
  flush();

  // 2) store — multi-field state without prop-drilling soup
  console.log("\n--- 2. store ---");
  const app = store({ count: 0, name: "Ada" });
  effect(() => {
    console.log(`  user=${app.name()} count=${app.count()}`);
  });
  app.set({ count: 3, name: "Grace" });

  // 3) resource — async without useEffect spaghetti
  console.log("\n--- 3. resource ---");
  const query = signal("powers");
  const search = resource(
    () => query(),
    async (q, { refetching }) => {
      console.log(`  fetching q="${q}" refetching=${refetching}`);
      return delay(30, `results-for:${q}`);
    },
  );

  effect(() => {
    console.log(
      `  data=${search() ?? "…"} loading=${search.loading()} state=${search.state()}`,
    );
  });

  // 4) batch
  console.log("\n--- 4. batch ---");
  batch(() => {
    app.count.set(10);
    app.name.set("Katherine");
  });

  // 5) handled error — graph keeps running
  console.log("\n--- 5. onError ---");
  const boom = signal(false);
  effect(() => {
    if (boom()) throw new Error("demo boom");
  });
  boom.set(true);
  flush();
  console.log("  (still alive after handled error)");

  // Wait for resource, then mutate + dispose
  setTimeout(() => {
    console.log("\n--- 6. source change + refetch ---");
    query.set("signals");
    setTimeout(() => {
      search.refetch();
      setTimeout(() => {
        console.log("\n--- 7. dispose root ---");
        dispose();
        count.set(99);
        flush();
        console.log("  (no further effects — root disposed)\n");
      }, 50);
    }, 50);
  }, 50);
});
