# Animation strategy

**Status: Phase 1.2 implemented** — `@power-ui/animate` v0.1.0

**Goal:** motion that feels world-class, with a **tiny learning curve**, native to Power UI’s signal model — without forcing every app to swallow a second mega-framework.

---

## Decision (shipped)

| Approach | Verdict |
|---|---|
| GSAP as the core animation engine | ❌ Not the default |
| Full GSAP competitor | ❌ Not our product |
| **Power-native signal tweens + optional GSAP later** | ✅ **Shipped path** |

---

## Mental model

```
signal → animate(signal, to, opts) → effect / future DOM reads the signal
```

```ts
import { signal } from "@power-ui/core";
import { animate, spring } from "@power-ui/animate";

const x = signal(0);

animate(x, 100, { duration: 300, ease: "easeOut" });
animate(x, 0, spring({ stiffness: 200, damping: 20 }));

// Interruptible — new animate() cancels the previous on the same signal
const playback = animate(x, 50, { duration: 200 });
playback.cancel();   // leave mid value
playback.complete(); // jump to end
await playback.finished;
```

---

## API surface (v0.1)

| API | Role |
|---|---|
| `animate(signal, to, opts?)` | Tween (default) or spring |
| `spring(opts?)` | Build spring options for `animate` |
| `cancel(signal)` | Cancel in-flight animation on a signal |
| `prefersReducedMotion()` | Read system preference |
| `setReducedMotionOverride(bool \| null)` | Tests / user settings |
| `createTestClock()` + `installDriver()` | Deterministic tests |

### Tween options

`duration`, `delay`, `ease` (name or fn), `from`, `respectReducedMotion`, `onUpdate`, `onComplete`, `onCancel`

### Spring options

`stiffness`, `damping`, `mass`, `velocity`, `restDelta`, `restSpeed`, plus shared delay/from/callbacks

### Easings

`linear`, `easeIn`, `easeOut`, `easeInOut`, cubic + back variants

---

## A11y

By default, if `prefers-reduced-motion: reduce` (or override), animations **snap to the end**.  
Opt out per call: `{ respectReducedMotion: false }`.

---

## Not in v0.1 (intentional)

- Timelines / ScrollTrigger / SVG morph (GSAP territory later)
- Color / complex string interpolation
- DOM enter/exit helpers (needs `@power-ui/dom`)
- GSAP adapter package

---

## Sequence

```
✅ Core 1.1
✅ Animate foundation
✅ Phase 2 thin DOM (+ browser demo wires animate ↔ style)
→  Compiler sugar / components
→  Optional GSAP adapter   ← parked, return when it makes sense (docs/NEXT.md)
```

## Size

Run `pnpm --filter @power-ui/animate size` — combined animate+core stays under a modest gzip budget.
