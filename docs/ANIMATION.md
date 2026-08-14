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

## Optional GSAP adapter

**Default path stays pure:** `import { animate } from "@power-ui/animate"` — no GSAP.

For pro motion (custom eases, timelines, ScrollTrigger, SVG):

```bash
pnpm add gsap
```

```ts
import { signal } from "@power-ui/core";
import { gsapAnimate, gsapFromTo, cancel } from "@power-ui/animate/gsap";
// or inject: createGsapBridge(gsap)

const x = signal(0);

// Duration is in **milliseconds** (same as animate()), converted for GSAP.
const anim = gsapAnimate(x, 100, {
  duration: 400,
  ease: "power3.out",
  // pass-through GSAP vars (repeat, yoyo, overwrite, …)
  vars: { overwrite: "auto" },
});

await anim.finished;
// anim.cancel() · anim.complete() · cancel(x)
```

| API | Role |
|---|---|
| `gsapAnimate(signal, to, opts?)` | GSAP-powered number tween |
| `gsapFromTo(signal, from, to, opts?)` | Explicit from → to |
| `createGsapBridge(gsap)` | Inject GSAP (or a mock) |
| `cancel(signal)` | Same registry as native `animate()` |

**Design rules**

1. GSAP is an **optional peer** — not bundled into the default `@power-ui/animate` entry.  
2. One active animation per signal; GSAP and native `animate()` share the registry (interrupt each other).  
3. Reduced motion still snaps to end by default.  
4. For pure DOM timelines (no signals), call GSAP directly on elements — no wrapper needed.

**Lab:** `pnpm example:browser` → [http://localhost:5173/lab?recipe=gsap](http://localhost:5173/lab?recipe=gsap)

---

## Not in the default package (intentional)

- Timelines / ScrollTrigger / SVG morph (use GSAP + this adapter or DOM GSAP)  
- Color / complex string interpolation  
- DOM enter/exit helpers (use `@power-ui/ui` Transition / CSS)

---

## Sequence

```
✅ Core 1.1
✅ Animate foundation
✅ Phase 2 thin DOM
✅ Optional GSAP adapter (`@power-ui/animate/gsap`)
```

## Size

Run `pnpm --filter @power-ui/animate size` — **default** entry only (GSAP not included).
