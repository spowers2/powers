/**
 * Animation foundation demo — no DOM, just signals over time.
 */
import { signal, effect, flush } from "@powers/core";
import {
  animate,
  spring,
  createTestClock,
  installDriver,
  setReducedMotionOverride,
} from "@powers/animate";

console.log("\n=== Powers animate demo ===\n");

// Deterministic clock so the demo finishes in-process (no real rAF wait).
const clock = createTestClock();
const restore = installDriver(clock.driver);
setReducedMotionOverride(false);

const x = signal(0);
const opacity = signal(1);

effect(() => {
  console.log(
    `  x=${x().toFixed(1).padStart(6)}  opacity=${opacity().toFixed(2)}`,
  );
});
flush();

console.log("--- tween x → 100 (300ms easeOut) ---");
const a = animate(x, 100, { duration: 300, ease: "easeOut" });
for (let i = 0; i < 20; i++) clock.advance(16);
// ensure finished
clock.advance(50);
console.log(`  playState=${a.playState}`);

console.log("\n--- interrupt: reverse x → 0 ---");
const b = animate(x, 0, { duration: 200, ease: "easeInOut" });
for (let i = 0; i < 8; i++) clock.advance(16);
console.log(`  mid interrupt state=${b.playState} x=${x().toFixed(1)}`);
clock.advance(200);
console.log(`  done state=${b.playState} x=${x()}`);

console.log("\n--- spring opacity → 0 ---");
const c = animate(opacity, 0, spring({ stiffness: 200, damping: 22 }));
for (let i = 0; i < 80; i++) clock.advance(16);
console.log(`  spring state=${c.playState} opacity=${opacity()}`);

console.log("\n--- reduced motion snaps ---");
setReducedMotionOverride(true);
const y = signal(0);
const d = animate(y, 50, { duration: 1000 });
console.log(`  y=${y()} state=${d.playState} (instant)`);

restore();
setReducedMotionOverride(null);
console.log("\nDone.\n");
