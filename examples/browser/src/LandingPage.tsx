/**
 * Marketing landing — modern, token-driven, live demos.
 * Navigation is provided by the shared SiteNav in AppShell.
 */
import { signal, computed, effect } from "@power-ui/core";
import type { Router } from "@power-ui/router";
import {
  Avatar,
  Badge,
  Button,
  Container,
  Progress,
  Stack,
  Text,
} from "@power-ui/ui";
import "./landing.css";

const SECTION_IDS = ["features", "learn", "compare"] as const;

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  );
}

/** Smooth-scroll to a section; accounts for sticky chrome. */
function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({
    behavior: prefersReducedMotion() ? "auto" : "smooth",
    block: "start",
  });
  // Keep URL shareable without fighting the history router path
  if (id === "top") {
    history.replaceState(null, "", location.pathname + location.search);
  } else {
    history.replaceState(null, "", `${location.pathname}${location.search}#${id}`);
  }
}

const NAMES = ["Ada Lovelace", "Grace Hopper", "Katherine Johnson"] as const;

export function LandingPage(props: { router: Router }) {
  const { router } = props;

  // Hero = a tiny product surface (not a counter toy)
  // Independent signals: only UI that *reads* a signal re-runs when it changes.
  const owner = signal<string>(NAMES[0]!);
  const progress = signal(42);
  const status = computed(() => {
    const p = progress();
    if (p >= 100) return "Shipped";
    if (p >= 60) return "In review";
    return "Building";
  });
  const statusTone = computed(() => {
    const p = progress();
    if (p >= 100) return "success" as const;
    if (p >= 60) return "accent" as const;
    return "neutral" as const;
  });

  const activeSection = signal<string>("top");
  const showBackTop = signal(false);

  const cycleOwner = () => {
    const i = NAMES.indexOf(owner() as (typeof NAMES)[number]);
    owner.set(NAMES[(i + 1) % NAMES.length]!);
  };

  const nudge = () => progress.set(Math.min(100, progress() + 18));
  const reset = () => {
    progress.set(42);
    owner.set(NAMES[0]!);
  };

  const go = (path: string) => () => router.navigate(path);

  // Active section + back-to-top visibility
  effect(() => {
    const onScroll = () => {
      const y = window.scrollY || document.documentElement.scrollTop;
      showBackTop.set(y > 420);

      let current: string = "top";
      for (const id of SECTION_IDS) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        // Section is active once its top crosses under sticky chrome
        if (top <= 120) current = id;
      }
      activeSection.set(current);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  });

  // Honor deep-link hash on first paint
  queueMicrotask(() => {
    const hash = location.hash.replace(/^#/, "");
    if (hash && (SECTION_IDS as readonly string[]).includes(hash)) {
      scrollToSection(hash);
    }
  });

  const anchorClass = (id: string) => () =>
    activeSection() === id ? "is-active" : "";

  return (
    <div class="lp lp-full">
      <div class="lp-mesh" aria-hidden="true" />

      <main id="top">
        {/* Sticky in-page anchors */}
        <div class="lp-anchors">
          <Container size="xl">
            <nav class="lp-anchors-inner" aria-label="On this page">
              <button
                type="button"
                class={anchorClass("features")}
                onClick={() => scrollToSection("features")}
              >
                Features
              </button>
              <button
                type="button"
                class={anchorClass("learn")}
                onClick={() => scrollToSection("learn")}
              >
                Learn
              </button>
              <button
                type="button"
                class={anchorClass("compare")}
                onClick={() => scrollToSection("compare")}
              >
                Why
              </button>
              <span class="lp-anchors-sep" aria-hidden="true" />
              <button
                type="button"
                class="lp-anchors-top"
                onClick={() => scrollToSection("top")}
              >
                ↑ Top
              </button>
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
                  One library for reactivity and UI chrome: fine-grained signals,
                  JSX that updates only what changed, a real router, and a design
                  system you retheme from a single token file — not a counter demo
                  bolted onto another framework.
                </p>
                <div class="lp-cta-row">
                  <Button size="lg" onClick={go("/lab")}>
                    Open Power Lab
                  </Button>
                  <Button size="lg" variant="ghost" onClick={go("/system")}>
                    Design system
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

              <div class="lp-stage" aria-label="Live product demo">
                <div class="lp-stage-inner">
                  <div class="lp-stage-bar" aria-hidden="true">
                    <i />
                    <i />
                    <i />
                  </div>

                  <div class="lp-stage-head">
                    <Badge tone="accent">Live · design system</Badge>
                    <Text muted size="xs">
                      Same primitives as production
                    </Text>
                  </div>

                  <div class="lp-project">
                    <Stack direction="row" gap={3} align="center">
                      <Avatar name={owner} size="md" />
                      <div class="lp-project-meta">
                        <Text weight="semibold" size="sm">
                          Release checklist
                        </Text>
                        <Text muted size="xs">
                          Owner: {() => owner()}
                        </Text>
                      </div>
                      <Badge tone={statusTone} class="lp-project-status">
                        {() => status()}
                      </Badge>
                    </Stack>

                    <div class="lp-project-progress">
                      <Progress value={progress} label="Ship readiness" />
                    </div>

                    <Stack direction="row" gap={2} wrap>
                      <Button size="sm" onClick={nudge}>
                        Advance
                      </Button>
                      <Button size="sm" variant="soft" onClick={cycleOwner}>
                        Switch owner
                      </Button>
                      <Button size="sm" variant="ghost" onClick={reset}>
                        Reset
                      </Button>
                    </Stack>

                    <p class="lp-stage-caption">
                      <strong>Fine-grained:</strong> Advance only re-runs Progress
                      + Badge. Switch owner only re-runs Avatar + name — the rest
                      stays put.
                    </p>
                  </div>

                  <div class="lp-code-mini">
                    <span class="k">const</span> progress ={" "}
                    <span class="k">signal</span>(42);
                    {"\n"}
                    <span class="k">const</span> status ={" "}
                    <span class="k">computed</span>(() =&gt; …);
                    {"\n"}
                    <span class="s">&lt;Progress value=&#123;progress&#125; /&gt;</span>
                    {"\n"}
                    <span class="s">&lt;Badge&gt;&#123;() =&gt; status()&#125;&lt;/Badge&gt;</span>
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
                  Learn in the Lab (edit live recipes), explore the design system,
                  then retheme everything from one tokens.css.
                </p>
              </div>
              <Stack direction="row" gap={2} wrap>
                <Button size="lg" onClick={go("/lab")}>
                  Open Power Lab
                </Button>
                <Button size="lg" variant="soft" onClick={go("/system")}>
                  Design system
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
              <button type="button" class="lp-footer-link" onClick={go("/lab")}>
                Lab
              </button>
              <button type="button" class="lp-footer-link" onClick={go("/system")}>
                System
              </button>
              <button type="button" class="lp-footer-link" onClick={go("/todos")}>
                Todos
              </button>
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

      {/* Floating return control when deep in the page */}
      <button
        type="button"
        class={() => `lp-back-top${showBackTop() ? " is-visible" : ""}`}
        aria-label="Back to top"
        onClick={() => scrollToSection("top")}
      >
        ↑ Top
      </button>
    </div>
  );
}
