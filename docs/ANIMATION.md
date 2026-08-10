# Animation strategy (recommendation — not implemented yet)

**Goal:** motion that feels world-class, with a **tiny learning curve**, native to Power UI’s signal model — without forcing every app to swallow a second mega-framework.

---

## Short answer

| Approach | Verdict |
|---|---|
| **GSAP as the core animation engine** | ❌ No — great tool, wrong default for “easiest UI library” |
| **Build a full GSAP competitor** | ❌ No — years of edge cases; dilutes the product |
| **Power-native signal tweens + optional GSAP bridge** | ✅ **Yes — this is the recommendation** |

**Ship first:** a small `@power-ui/animate` (name TBD) that animates **values** (`signal`s).  
**Ship later (optional):** first-class GSAP interop for teams that already live in timelines/plugins.

---

## Why not “just use GSAP” as the foundation?

GSAP is excellent for:

- Complex timelines, scroll triggers, SVG morphs, pro motion-design workflows
- Battle-tested easing, sequencing, and browser quirks

It is a **poor default core** for Power UI because:

1. **Learning curve stacks** — developers would learn Power UI *and* GSAP’s model  
2. **Two sources of truth** — GSAP mutates DOM/style; Power UI mutates signals → easy to fight each other  
3. **Bundle & product identity** — “best UI library” shouldn’t require a second heavyweight runtime on day one  
4. **License / dependency surface** — fine as an *optional* peer; risky as a hard core dependency  
5. **SSR / non-DOM** — our core works in Node today; animation of pure values should too (tests, canvases, native later)

GSAP should be a **power-user escape hatch**, not the on-ramp.

---

## Why not build “our own GSAP”?

Reimplementing the full GSAP surface (plugins, ScrollTrigger, MorphSVG, Draggable, etc.) is a multi-year product of its own. It would:

- Delay `@power-ui/dom` and real adoption  
- Never match GSAP’s niche depth in v1  
- Violate our “small learning curve” promise with a huge API

**Steal the best 10% of the idea, not the whole zoo.**

---

## Recommended design: signal-native motion

### Mental model (fits the 5-idea learn path)

```
signal → animate that signal → effect/DOM reads the signal
```

Developers already know `signal`. Animation is just:

> “Change this signal over time with an easing curve.”

```ts
// Illustrative API — not shipped yet
import { signal } from "@power-ui/core";
import { animate, spring } from "@power-ui/animate";

const x = signal(0);
const opacity = signal(1);

// Imperative, obvious
animate(x, 100, { duration: 300, ease: "easeOut" });

// Spring physics for UI feel
animate(opacity, 0, spring({ stiffness: 200, damping: 20 }));

// Interruptible — new animate() wins, no ghost tweens
animate(x, 0, { duration: 200 });
```

### Declarative companion (Phase 2 DOM)

```ts
// Later, with DOM bindings — still one mental model
// "when open changes, spring height/opacity"
```

Same graph: no parallel “animation state” silo.

### What v1 of `@power-ui/animate` should include

| Feature | Why |
|---|---|
| Tween numbers (and colors later) on `signal`s | Core use case |
| Duration + cubic-bezier / named easings | 90% of UI motion |
| Springs | Modern feel (iOS-like) without timelines |
| `cancel` / interrupt | Essential for hover & gesture UIs |
| `onComplete` / promise | Async flows |
| `reducedMotion` respect | A11y by default — matches Power UI values |
| Batch-friendly updates | Drive many signals without thrashing effects |
| **&lt; ~3–5 KB gzip target** | Stay on-brand vs core’s ~2 KB |

### What v1 should explicitly skip

- Full timeline studio (GSAP territory)  
- ScrollTrigger clone  
- SVG morph plugins  
- Drag physics suite  

Those remain “use GSAP via adapter” if needed.

---

## GSAP interop (phase after native animate + DOM)

Provide a thin adapter, not a rewrite:

```ts
// Illustrative
import gsap from "gsap";
import { syncSignal } from "@power-ui/animate/gsap";

const x = signal(0);
// GSAP tweens a proxy; signal updates each tick → Power UI DOM bindings follow
```

Or: GSAP targets real DOM nodes for hero marketing pages while app chrome stays signal-native.

**Positioning:**

- **Default path:** `@power-ui/animate` (learn in minutes)  
- **Pro path:** GSAP optional peer for cinematic / marketing / SVG  

---

## How this relates to the DOM roadmap

```
NOW     Core 1.1 (done)
NEXT    Animation foundation (signal tweens)     ← your request
THEN    Phase 2 thin DOM  (parked in docs/NEXT.md)  ← resume immediately after
LATER   Wire animate ↔ DOM (layout, FLIP-ish, enter/exit)
OPTIONAL GSAP adapter
```

**Why animation before full DOM is OK:**  
Tweens only need signals + `requestAnimationFrame`. We can test motion in Node with a fake clock, prove interrupt/a11y, then plug the same APIs into DOM bindings.

**Why not delay animation until after a huge DOM/compiler:**  
Enter/exit and gesture UIs are table stakes for “best UI library.” Designing bindings without a motion model often bolts animation on as an afterthought (React’s historical pain).

---

## Competitive notes (steal, don’t copy)

| Source | Steal |
|---|---|
| **Motion One / Popmotion** | Small, modern, WAAPI-friendly thinking |
| **GSAP** | Timeline power as *optional* interop; easing quality bar |
| **Framer Motion** | Declarative variants *idea* — but keep API smaller |
| **Solid / Vue motion libs** | Signal-friendly patterns |
| **iOS / Flutter springs** | Default spring feel for interactive UI |

---

## Success criteria (when we implement)

1. **Learn in &lt; 5 minutes** if you already know `signal`  
2. **Interruptible** animations by default  
3. **`prefers-reduced-motion`** honored without extra setup  
4. **No GSAP required** for excellent app UI motion  
5. **GSAP possible** without rewriting the app  
6. Size stays modest; core remains ~2 KB-class; animate stays single-digit KB  

---

## Decision record

| Decision | Choice |
|---|---|
| Core engine | **Own signal-native tween/spring library** |
| GSAP | **Optional adapter later**, not the default |
| Build full GSAP clone | **No** |
| Sequence | **Animate foundation → Phase 2 DOM → integrate → optional GSAP** |

When ready to implement: start with `packages/animate` + tests (fake `rAF`), then resume [`docs/NEXT.md`](./NEXT.md) Phase 2 DOM.
