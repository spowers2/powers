# Powers Pro Patterns — file structure

Your private Figma file (invited after purchase) is organized like this:

| Page | What’s on it |
|------|----------------|
| **Cover** | Title, version, entry points |
| **01 Auth** | Sign in · Sign up · Forgot (+ error / sent states) |
| **02 App shell** | Desktop nav + phone Menu shell |
| **03 Dashboard** | Stats + pipeline + activity |
| **04 Admin list** | Toolbar + table / mobile cards |
| **05 Billing** | Invoice stats, list, drawer |
| **06 Settings** | Profile · appearance · danger + confirm |
| **07 Empty states** | Empty · error · loading |
| **08 Theme board** | Same UI in Slate · Warm · Mono |

All controls are **Powers UI Kit** instances. Pair with the markdown recipes in `../patterns/` if you extend screens.

How we build/maintain this file: monorepo `design-kit/pro/FIGMA_PRO_PATTERNS.md`.
