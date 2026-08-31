/**
 * Product landing — minimal hero + live showcase + clean feature grid.
 * Navigation is provided by the shared SiteNav in AppShell.
 */
import { signal, computed, effect } from "@lab206/core";
import type { Router } from "@lab206/router";
import {
  Avatar,
  Badge,
  Button,
  Container,
  Field,
  Input,
  Progress,
  Stack,
  Switch,
  Text,
} from "@lab206/ui";
import {
  createSectionNav,
  scrollToSection,
  tocActiveClass,
} from "./scrollNav.js";
import { SITE } from "./siteConfig.js";
import "./landing.css";



const SECTION_IDS = ["demos", "features", "learn", "compare"] as const;

const NAMES = ["Ada Lovelace", "Grace Hopper", "Katherine Johnson"] as const;

const SHOWCASE_SLIDES = [
  { id: "release", label: "Release" },
  { id: "forms", label: "Forms" },
  { id: "system", label: "System" },
] as const;

type ShowcaseId = (typeof SHOWCASE_SLIDES)[number]["id"];

const FEATURES: Array<{
  title: string;
  body: string;
  href: string;
  external?: boolean;
}> = [
  {
    title: "Fine-grained updates",
    body: "Only the bindings that read a signal re-run — not a virtual tree.",
    href: "/docs",
  },
  {
    title: "Design tokens",
    body: "One tokens file drives brand, type, space, and dark mode.",
    href: "/system#sys-color",
  },
  {
    title: "Forms that stay mounted",
    body: "bind + Field validation without remounting the whole screen.",
    href: "/lab?recipe=form",
  },
  {
    title: "Router, one outlet",
    body: "Explicit routes and a single outlet host — no double-render traps.",
    href: "/docs",
  },
  {
    title: "Lab + System",
    body: "Start here recipes + Copy JSX on every major control.",
    href: "/lab?recipe=hello",
  },
  {
    title: "Figma plugin",
    body: "Powers Design Kit is live on Community — sync variables, audit catalog, stubs.",
    href: "https://www.figma.com/community/plugin/1671016490810398688",
    external: true,
  },
];

export function LandingPage(props: { router: Router }) {
  const { router } = props;

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

  const email = signal("you@studio.dev");
  const emailTouched = signal(false);
  const emailError = () => {
    if (!emailTouched()) return "";
    const v = email().trim();
    if (!v) return "Email is required";
    return v.includes("@") ? "" : "Enter a valid email";
  };

  const notify = signal(true);
  const dense = signal(false);

  const slide = signal(0);

  const showBackTop = signal(false);
  const sectionNav = createSectionNav(SECTION_IDS);
  sectionNav.bindScrollSpy();
  queueMicrotask(() => sectionNav.initFromHash());

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

  const setSlide = (i: number) => {
    const n = SHOWCASE_SLIDES.length;
    slide.set(((i % n) + n) % n);
  };

  const activeSlide = (): ShowcaseId =>
    SHOWCASE_SLIDES[slide()]?.id ?? "release";

  effect(() => {
    const onScroll = () => {
      const y = window.scrollY || document.documentElement.scrollTop;
      showBackTop.set(y > 420);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  });

  const anchorClass = (id: string) =>
    tocActiveClass(sectionNav.activeId, id);

  return (
    <div class="lp lp-full">
      <div class="lp-mesh" aria-hidden="true" />

      <main id="top">
        <div class="lp-anchors">
          <Container size="xl">
            <nav class="lp-anchors-inner" aria-label="On this page">
              <button
                type="button"
                class={anchorClass("demos")}
                onClick={() => sectionNav.scrollTo("demos")}
              >
                Demos
              </button>
              <button
                type="button"
                class={anchorClass("features")}
                onClick={() => sectionNav.scrollTo("features")}
              >
                Features
              </button>
              <button
                type="button"
                class={anchorClass("learn")}
                onClick={() => sectionNav.scrollTo("learn")}
              >
                Learn
              </button>
              <button
                type="button"
                class={anchorClass("compare")}
                onClick={() => sectionNav.scrollTo("compare")}
              >
                Why
              </button>
              <span class="lp-anchors-sep" aria-hidden="true" />
              <button
                type="button"
                class="lp-anchors-top"
                onClick={() => sectionNav.scrollTo("top")}
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
              <div class="lp-hero-copy">
                <p class="lp-product-label">{SITE.name}</p>
                <h1 class="lp-title">
                  Ship the interface.{" "}
                  <span class="lp-title-gradient">Skip the framework soup.</span>
                </h1>
                <p class="lp-lede">
                  Built on the {SITE.systemName} UI system — signals, components,
                  and tokens. Scaffold a Vite app in minutes, or explore demos,
                  Lab, and the Figma library first.
                </p>

                <div class="lp-cta-row">
                  <Button
                    size="lg"
                    onClick={() =>
                      window.open(
                        SITE.demos.workspace.href,
                        "_blank",
                        "noopener,noreferrer",
                      )
                    }
                  >
                    Open {SITE.demos.workspace.label}
                  </Button>
                  <Button
                    size="lg"
                    variant="soft"
                    onClick={go("/lab?recipe=hello")}
                  >
                    Lab · Start here
                  </Button>
                  <Button size="lg" variant="ghost" onClick={go("/docs")}>
                    Install
                  </Button>
                </div>
                <pre class="lp-install" aria-label="Install Powers">{`pnpm create powers my-app`}</pre>

                <div class="lp-product-links" aria-label="Product demos">
                  <a
                    href={SITE.demos.workspace.href}
                    {...SITE.demoLinkAttrs}
                  >
                    {SITE.demos.workspace.label}
                  </a>
                  <span class="lp-product-links__sep" aria-hidden="true">
                    ·
                  </span>
                  <a href={SITE.demos.hearth.href} {...SITE.demoLinkAttrs}>
                    {SITE.demos.hearth.label}
                  </a>
                  <span class="lp-product-links__sep" aria-hidden="true">
                    ·
                  </span>
                  <button type="button" onClick={go("/docs")}>
                    Docs
                  </button>
                  <span class="lp-product-links__sep" aria-hidden="true">
                    ·
                  </span>
                  <button type="button" onClick={go("/system")}>
                    System
                  </button>
                  <span class="lp-product-links__sep" aria-hidden="true">
                    ·
                  </span>
                  <a
                    href={SITE.figma.pluginUrl}
                    target="_blank"
                    rel="noreferrer"
                    title="Install from Figma Community"
                  >
                    Figma plugin
                  </a>
                </div>

                <ul class="lp-feature-row" aria-label="Highlights">
                  <li>Products</li>
                  <li>Figma plugin</li>
                  <li>Signals</li>
                  <li>Lab</li>
                </ul>
              </div>

              {/* Live product showcase (not a marketing banner) */}
              <div class="lp-stage" aria-label="Live product showcase">
                <div class="lp-stage-inner">
                  <div class="lp-stage-bar" aria-hidden="true">
                    <i />
                    <i />
                    <i />
                    <span>
                      {() =>
                        `${SHOWCASE_SLIDES[slide()]?.label ?? "Release"} · live`
                      }
                    </span>
                  </div>

                  <div
                    class="lp-showcase-tabs"
                    role="tablist"
                    aria-label="Showcase slides"
                  >
                    {SHOWCASE_SLIDES.map((s, i) => (
                      <button
                        type="button"
                        role="tab"
                        class={() =>
                          slide() === i
                            ? "lp-showcase-tab is-active"
                            : "lp-showcase-tab"
                        }
                        aria-selected={() => (slide() === i ? "true" : "false")}
                        onClick={() => setSlide(i)}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>

                  <div class="lp-showcase-panel" role="tabpanel">
                    {/* Release */}
                    <div
                      class={() =>
                        activeSlide() === "release"
                          ? "lp-showcase-slide is-active"
                          : "lp-showcase-slide"
                      }
                    >
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
                          Advance only updates progress and status. Switch owner
                          only updates the avatar and name.
                        </p>
                      </div>
                    </div>

                    {/* Forms */}
                    <div
                      class={() =>
                        activeSlide() === "forms"
                          ? "lp-showcase-slide is-active"
                          : "lp-showcase-slide"
                      }
                    >
                      <div class="lp-project">
                        <Text weight="semibold" size="sm">
                          Account email
                        </Text>
                        <Field
                          label="Work email"
                          htmlFor="lp-email"
                          error={emailError}
                          hint="bind + live validation — field stays mounted."
                        >
                          <Input
                            id="lp-email"
                            type="email"
                            bind={email}
                            onBlur={() => emailTouched.set(true)}
                            aria-invalid={() => !!emailError()}
                          />
                        </Field>
                        <Stack direction="row" gap={2} wrap>
                          <Button
                            size="sm"
                            onClick={() => {
                              emailTouched.set(true);
                              if (!emailError()) {
                                /* demo only */
                              }
                            }}
                          >
                            Save
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              email.set("you@studio.dev");
                              emailTouched.set(false);
                            }}
                          >
                            Reset
                          </Button>
                        </Stack>
                        <p class="lp-stage-caption">
                          Try clearing the field or removing @ — the form does
                          not remount.
                        </p>
                      </div>
                    </div>

                    {/* System */}
                    <div
                      class={() =>
                        activeSlide() === "system"
                          ? "lp-showcase-slide is-active"
                          : "lp-showcase-slide"
                      }
                    >
                      <div
                        class={() =>
                          dense()
                            ? "lp-project lp-project--dense"
                            : "lp-project"
                        }
                      >
                        <Text weight="semibold" size="sm">
                          Workspace prefs
                        </Text>
                        <Switch
                          label="Product updates"
                          bind={notify}
                        />
                        <Switch
                          label="Compact density"
                          bind={dense}
                        />
                        <Text muted size="xs">
                          {() =>
                            notify()
                              ? "Notifications on"
                              : "Notifications off"
                          }
                          {" · "}
                          {() => (dense() ? "Dense UI" : "Comfortable UI")}
                        </Text>
                        <p class="lp-stage-caption">
                          Design-system controls — same Switch and density
                          patterns as production apps.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="lp-paths" aria-label="Start here by role">
              <p class="lp-paths-title">Then dig in</p>
              <div class="lp-paths-grid">
                <button
                  type="button"
                  class="lp-path-card"
                  onClick={go("/lab?recipe=hello")}
                >
                  <strong>Engineers</strong>
                  <span>Lab Start here · Docs · forms that stay mounted.</span>
                </button>
                <a
                  class="lp-path-card"
                  href={SITE.figma.pluginUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  <strong>Design</strong>
                  <span>
                    Install {SITE.figma.pluginLabel} from Figma Community —
                    sync tokens, audit the kit. Also explore System in-app.
                  </span>
                </a>
                <button
                  type="button"
                  class="lp-path-card"
                  onClick={go("/lab?recipe=settings")}
                >
                  <strong>Cookbook</strong>
                  <span>
                    Settings, admin lists, and validation you can steal.
                  </span>
                </button>
              </div>
            </div>
          </Container>
        </section>

        {/* DEMO APPS — flagship product story */}
        <section class="lp-section" id="demos">
          <Container size="xl">
            <div class="lp-section-head">
              <h2 class="lp-section-title">
                Products built with {SITE.systemName}
              </h2>
              <p class="lp-section-sub">
                Flagship demos — full apps, not kitchen sinks. This is the
                product proof; Lab and System teach the kit underneath.
              </p>
            </div>
            <div class="lp-demo-grid">
              <a
                class="lp-demo-card"
                href={SITE.demos.workspace.href}
                {...SITE.demoLinkAttrs}
              >
                <div class="lp-demo-card__kicker">Flagship · workspace</div>
                <h3>{SITE.demos.workspace.label}</h3>
                <p>
                  Freelance studio workspace: clients, pipeline, invoices, time
                  → draft bills, client portal. Local-first with real workflows.
                </p>
                <span class="lp-demo-card__cta">Open product →</span>
              </a>
              <a
                class="lp-demo-card lp-demo-card--hearth"
                href={SITE.demos.hearth.href}
                {...SITE.demoLinkAttrs}
              >
                <div class="lp-demo-card__kicker">Ops · hearth</div>
                <h3>{SITE.demos.hearth.label}</h3>
                <p>
                  Restaurant floor: menu, reservations, kitchen board, table
                  map. Same kit, different product surface.
                </p>
                <span class="lp-demo-card__cta">Open product →</span>
              </a>
            </div>
          </Container>
        </section>

        {/* FEATURES — clean 6-up */}
        <section class="lp-section" id="features">
          <Container size="xl">
            <div class="lp-section-head">
              <h2 class="lp-section-title">
                Everything you need, nothing you don’t
              </h2>
              <p class="lp-section-sub">
                One mental model from state to screen — packages stay small and
                tree-shakeable.
              </p>
            </div>

            <div class="lp-feat-grid">
              {FEATURES.map((f) =>
                f.external ? (
                  <a
                    class="lp-feat-card"
                    href={f.href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <strong>{f.title}</strong>
                    <span>{f.body}</span>
                  </a>
                ) : (
                  <button
                    type="button"
                    class="lp-feat-card"
                    onClick={go(f.href)}
                  >
                    <strong>{f.title}</strong>
                    <span>{f.body}</span>
                  </button>
                ),
              )}
            </div>
          </Container>
        </section>

        {/* LEARN PATH */}
        <section class="lp-section" id="learn">
          <Container size="xl">
            <div class="lp-section-head">
              <h2 class="lp-section-title">The whole core is five ideas</h2>
              <p class="lp-section-sub">
                Master these and you already think in Powers. Everything else is
                projection: DOM, routes, tokens.
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
{`import { signal, computed } from "@lab206/core";
import { mount } from "@lab206/dom";

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
              <h2 class="lp-section-title">
                Clear defaults. Escape hatches when you need them.
              </h2>
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
                    <th>Powers</th>
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
                    <td>
                      Optional <code>animate/gsap</code> peer
                    </td>
                    <td class="lp-meh">Often bolted on</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Container>
        </section>

        <Container size="xl">
          <div class="lp-cta">
            <div class="lp-cta-inner">
              <div>
                <h2>Ship something that feels inevitable</h2>
                <p>
                  Learn in the Lab, explore System, or open a full product demo:
                  designlab206 (:5180) or Hearth (:5181).
                </p>
              </div>
              <Stack direction="row" gap={2} wrap>
                <Button size="lg" onClick={go("/docs")}>
                  Get started
                </Button>
                <Button size="lg" variant="soft" onClick={go("/lab")}>
                  Practice in Lab
                </Button>
                <Button
                  size="lg"
                  variant="ghost"
                  onClick={go(SITE.contact.commercialHref)}
                >
                  Commercial license
                </Button>
              </Stack>
            </div>
          </div>
        </Container>
      </main>

      <footer class="lp-footer">
        <Container size="xl">
          <div class="lp-footer-inner">
            <span>
              {SITE.name} · powered by {SITE.systemName} · BSL-1.1
              (source-available)
            </span>
            <Stack direction="row" gap={4}>
              <button type="button" class="lp-footer-link" onClick={go("/docs")}>
                Docs
              </button>
              <button type="button" class="lp-footer-link" onClick={go("/lab")}>
                Lab
              </button>
              <button
                type="button"
                class="lp-footer-link"
                onClick={go("/system")}
              >
                System
              </button>
              <button
                type="button"
                class="lp-footer-link"
                onClick={go(SITE.contact.commercialHref)}
              >
                Licensing
              </button>
              <a
                class="lp-footer-link"
                href={SITE.demos.workspace.href}
                {...SITE.demoLinkAttrs}
              >
                {SITE.demos.workspace.label}
              </a>
              <a
                class="lp-footer-link"
                href={SITE.demos.hearth.href}
                {...SITE.demoLinkAttrs}
              >
                {SITE.demos.hearth.label}
              </a>
              <a
                class="lp-footer-link"
                href={SITE.figma.pluginUrl}
                target="_blank"
                rel="noreferrer"
              >
                Figma plugin
              </a>
              <button
                type="button"
                class="lp-footer-link"
                onClick={go(SITE.contact.href)}
              >
                {SITE.contact.label}
              </button>
              <a
                class="lp-footer-link"
                href={SITE.contact.githubIssues}
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub Issues
              </a>
              <a
                href={SITE.contact.githubRepo}
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </a>
            </Stack>
          </div>
        </Container>
      </footer>

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
