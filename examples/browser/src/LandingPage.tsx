/**
 * Marketing landing — modern, token-driven, live demos.
 * Navigation is provided by the shared SiteNav in AppShell.
 */
import { signal } from "@power-ui/core";
import { animate, spring } from "@power-ui/animate";
import { bindStyle } from "@power-ui/dom";
import type { Router } from "@power-ui/router";
import { Link } from "@power-ui/router";
import { Badge, Button, Container, Stack } from "@power-ui/ui";
import "./landing.css";

export function LandingPage(props: { router: Router }) {
  const { router } = props;

  // Live hero demo
  const count = signal(0);
  const x = signal(0);
  const orb = (<div class="lp-orb" />) as HTMLElement;
  bindStyle(orb, () => ({ transform: `translateX(${x()}px)` }));

  const bump = (d: number) => {
    count.update((n) => Math.max(0, n + d));
    animate(x, d > 0 ? 72 : 0, spring({ stiffness: 260, damping: 18 }));
  };

  const go = (path: string) => () => router.navigate(path);

  return (
    <div class="lp lp-full">
      <div class="lp-mesh" aria-hidden="true" />

      <main id="top">
        {/* In-page anchors (secondary) */}
        <div class="lp-anchors">
          <Container size="xl">
            <nav class="lp-anchors-inner" aria-label="On this page">
              <a href="#features">Features</a>
              <a href="#learn">Learn</a>
              <a href="#compare">Why</a>
            </nav>
          </Container>
        </div>

        {/* HERO */}
        <section class="lp-hero">
          <Container size="xl">
            <div class="lp-hero-grid">
              <div>
                <div class="lp-kicker">
                  <span class="lp-kicker-dot" aria-hidden="true" />
                  <Badge tone="accent">Fine-grained · JSX · Design tokens</Badge>
                </div>
                <h1 class="lp-title">
                  The UI runtime that{" "}
                  <span class="lp-title-gradient">updates only what changed</span>
                </h1>
                <p class="lp-lede">
                  Power UI is a signal-first library with a tiny learning curve:
                  five ideas for state, explicit DOM bindings, springs for motion,
                  a real router, and a design system you retheme by editing one
                  token file.
                </p>
                <div class="lp-cta-row">
                  <Button size="lg" onClick={go("/lab")}>
                    Open Power Lab
                  </Button>
                  <Button size="lg" variant="ghost" onClick={go("/playground")}>
                    Component playground
                  </Button>
                </div>
                <div class="lp-meta">
                  <span>
                    <strong>No VDOM</strong> by default
                  </span>
                  <span>
                    <strong>No</strong> dependency arrays
                  </span>
                  <span>
                    <strong>~2–3 KB</strong> core / package class
                  </span>
                </div>
              </div>

              <div class="lp-stage" aria-label="Live demo">
                <div class="lp-stage-inner">
                  <div class="lp-stage-bar" aria-hidden="true">
                    <i />
                    <i />
                    <i />
                  </div>
                  <Badge tone="success">Live signal</Badge>
                  <div class="lp-live-count">{() => String(count())}</div>
                  {orb}
                  <Stack direction="row" gap={2} wrap>
                    <Button size="sm" variant="soft" onClick={() => bump(-1)}>
                      −1
                    </Button>
                    <Button size="sm" onClick={() => bump(1)}>
                      +1
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        count.set(0);
                        animate(x, 0, { duration: 220, ease: "easeOut" });
                      }}
                    >
                      Reset
                    </Button>
                  </Stack>
                  <div class="lp-code-mini">
                    <span class="k">const</span> n = <span class="k">signal</span>(0);
                    {"\n"}
                    <span class="k">animate</span>(x, 72, <span class="k">spring</span>());
                    {"\n"}
                    {"// only bindings that read n / x update"}
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* FEATURES BENTO */}
        <section class="lp-section" id="features">
          <Container size="xl">
            <div class="lp-section-head">
              <h2 class="lp-section-title">Built like a system, not a tangle of libraries</h2>
              <p class="lp-section-sub">
                One mental model from state to screen to motion to chrome —
                packages stay small and tree-shakeable.
              </p>
            </div>

            <div class="lp-bento">
              <article class="lp-tile lp-bento-wide">
                <div class="lp-tile-glow" aria-hidden="true" />
                <div class="lp-tile-icon">⚡</div>
                <h3>Fine-grained by default</h3>
                <p>
                  Signals, computed, and effects track exact dependencies. When
                  data changes, only the bindings that read it re-run — not a
                  virtual tree, not your whole page.
                </p>
              </article>

              <article class="lp-tile lp-bento-tall">
                <div class="lp-tile-icon">🎯</div>
                <h3>Learn in an afternoon</h3>
                <p>
                  signal → computed → effect → store → resource. Then mount,
                  JSX, props, router, tokens. No dual “hooks vs render” model.
                </p>
              </article>

              <article class="lp-tile lp-bento-sm">
                <div class="lp-tile-icon">🎞</div>
                <h3>Motion on values</h3>
                <p>
                  Tweens and springs animate signals. Bind style once; GSAP stays
                  an optional pro path later.
                </p>
              </article>

              <article class="lp-tile lp-bento-sm">
                <div class="lp-tile-icon">🧭</div>
                <h3>Tiny router</h3>
                <p>
                  createRouter, Link, params, memory/history modes. Explicit and
                  testable.
                </p>
              </article>

              <article class="lp-tile lp-bento-mid">
                <div class="lp-tile-icon">🎨</div>
                <h3>Design system you actually edit</h3>
                <p>
                  One tokens.css drives brand, space, type, and dark mode.
                  Primitives (Button, Input, Stack, Card…) only speak semantic
                  variables — retheme without hunting components.
                </p>
              </article>

              <article class="lp-tile lp-bento-mid">
                <div class="lp-tile-icon">📦</div>
                <h3>Composable packages</h3>
                <p>
                  @power-ui/core · animate · dom · router · ssr · ui. Use only
                  what you need; SSR foundation ready for islands next.
                </p>
              </article>
            </div>
          </Container>
        </section>

        {/* LEARN PATH */}
        <section class="lp-section" id="learn">
          <Container size="xl">
            <div class="lp-section-head">
              <h2 class="lp-section-title">The whole core is five ideas</h2>
              <p class="lp-section-sub">
                Master these and you already think in Power UI. Everything else
                is projection: DOM, routes, tokens.
              </p>
            </div>
            <div class="lp-steps">
              <div class="lp-step">
                <strong>signal</strong>
                <span>A value that can change</span>
              </div>
              <div class="lp-step">
                <strong>computed</strong>
                <span>Derived, cached</span>
              </div>
              <div class="lp-step">
                <strong>effect</strong>
                <span>Run when deps change</span>
              </div>
              <div class="lp-step">
                <strong>store</strong>
                <span>Multi-field state</span>
              </div>
              <div class="lp-step">
                <strong>resource</strong>
                <span>Async without spaghetti</span>
              </div>
            </div>
            <pre class="lp-snippet">
{`import { signal, computed } from "@power-ui/core";
import { mount } from "@power-ui/dom";

const count = signal(0);
const label = computed(() => \`Clicks: \${count()}\`);

mount(document.getElementById("app")!, () => (
  <button type="button" onClick={() => count.update(n => n + 1)}>
    {() => label()}
  </button>
));`}
            </pre>
            <p class="lp-snippet-note">
              Reactive rule: {"{() => count()}"} stays live — {"{count()}"} is a
              snapshot.
            </p>
          </Container>
        </section>

        {/* COMPARE */}
        <section class="lp-section" id="compare">
          <Container size="xl">
            <div class="lp-section-head">
              <h2 class="lp-section-title">Clear defaults. Escape hatches when you need them.</h2>
              <p class="lp-section-sub">
                Opinionated where it reduces cognitive load — open where power
                users require it.
              </p>
            </div>
            <div class="lp-table-wrap">
              <table class="lp-table">
                <thead>
                  <tr>
                    <th>Concern</th>
                    <th>Power UI</th>
                    <th>Typical alternative</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Updates</td>
                    <td>Fine-grained signals</td>
                    <td class="lp-meh">VDOM / whole component</td>
                  </tr>
                  <tr>
                    <td>Dependencies</td>
                    <td>
                      <span class="lp-check">Automatic</span>
                    </td>
                    <td class="lp-meh">Manual arrays</td>
                  </tr>
                  <tr>
                    <td>Motion</td>
                    <td>Animate values (springs)</td>
                    <td class="lp-meh">CSS-only or heavy libs</td>
                  </tr>
                  <tr>
                    <td>Theming</td>
                    <td>One tokens.css</td>
                    <td class="lp-meh">Scattered overrides</td>
                  </tr>
                  <tr>
                    <td>Pro motion</td>
                    <td>GSAP adapter planned (optional)</td>
                    <td class="lp-meh">Often bolted on</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Container>
        </section>

        {/* CTA */}
        <Container size="xl">
          <div class="lp-cta">
            <div class="lp-cta-inner">
              <div>
                <h2>Ship something that feels inevitable</h2>
                <p>
                  Open the playground, flip the theme, break the counter, then
                  retheme the world from tokens.css.
                </p>
              </div>
              <Stack direction="row" gap={2} wrap>
                <Button size="lg" onClick={go("/playground")}>
                  Launch playground
                </Button>
                <Button size="lg" variant="soft" onClick={go("/todos")}>
                  Todos example
                </Button>
              </Stack>
            </div>
          </div>
        </Container>
      </main>

      <footer class="lp-footer">
        <Container size="xl">
          <div class="lp-footer-inner">
            <span>Power UI — MIT · private foundations</span>
            <Stack direction="row" gap={4}>
              <Link router={router} to="/playground">
                Playground
              </Link>
              <Link router={router} to="/todos">
                Todos
              </Link>
              <a
                href="https://github.com/spowers2/power-ui"
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </a>
            </Stack>
          </div>
        </Container>
      </footer>
    </div>
  );
}
