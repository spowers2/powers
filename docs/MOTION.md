# Motion language

Named presets so apps feel consistent without inventing CSS every time.

## When to use what

| Need | Tool |
|---|---|
| Show/hide panel, dialog body, toast | UI `<Transition name="pu-fade">` |
| Accordion / expand height | `<Transition name="pu-collapse">` |
| Button press / hover | Built into controls (respects reduced motion) |
| Number / progress tween | `@power-ui/animate` `animate` / `spring` on a **signal** |
| Complex timelines, scrub, SVG | Optional peer **GSAP** via `@power-ui/animate/gsap` |

**Rule:** prefer CSS Transition presets for enter/exit chrome. Prefer signal animation when the **value** itself moves (progress bar, counter, drag). Reach for GSAP only when product motion needs timelines.

All motion should honor `prefers-reduced-motion` (controls already do; GSAP bridge should too).

## Transition presets

Use with `<Transition name="…" show={open}>`:

| Name | Use |
|---|---|
| `pu-fade` | Default soft enter/exit (overlays, content swap) |
| `pu-collapse` | Height expand/collapse (accordion-like) |

```tsx
import { signal } from "@power-ui/core";
import { Transition, Button, Card } from "@power-ui/ui";

const open = signal(true);

<Button onClick={() => open.update((v) => !v)}>Toggle</Button>
<Transition name="pu-fade" show={open}>
  <Card>Hello</Card>
</Transition>
```

`MOTION_PRESETS` exports the catalog for docs/tools:

```ts
import { MOTION_PRESETS } from "@power-ui/ui";
// [{ name: "pu-fade", label, use, duration }, …]
```

## Tokens

| Token | Role |
|---|---|
| `--pu-duration-fast` / `--pu-duration` / `--pu-duration-slow` | Timing scale |
| `--pu-ease` / `--pu-ease-out` / `--pu-ease-spring` | Curves |

`motionVars({ duration, ease })` builds inline CSS variables for one-off motion.

## Animate package

Number signals / springs: `@power-ui/animate` (`animate`, `spring`, `cancel`).  
Use for continuous values (counters, springs). Use **Transition** for mount/unmount UI chrome.

## Reduced motion

Presets and base.css shorten/disable transitions when `prefers-reduced-motion: reduce`.

## Lab

**`/lab?recipe=motion`**
