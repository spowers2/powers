/**
 * In-app docs: how to start + API reference.
 * Markdown lives in /docs for repo readers; this is what demo visitors actually see.
 */
import type { Router } from "@power-ux/router";
import {
  Alert,
  Badge,
  Button,
  Card,
  Code,
  Container,
  Divider,
  Grid,
  Kbd,
  Stack,
  Text,
} from "@power-ux/ui";
import { createSectionNav, tocActiveClass } from "./scrollNav.js";
import "./docs.css";

const DOC_SECTIONS = [
  "paths",
  "start",
  "rules",
  "first-app",
  "packages",
  "patterns",
  "api-core",
  "api-dom",
  "api-ui",
  "api-animate",
  "api-router",
  "next",
] as const;

type ApiRow = { name: string; sig: string; note: string };

function ApiTable(props: { rows: ApiRow[] }) {
  return (
    <div class="docs-table-wrap">
      <table class="docs-table">
        <thead>
          <tr>
            <th>API</th>
            <th>Signature / usage</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          {props.rows.map((r) => (
            <tr>
              <td>
                <code>{r.name}</code>
              </td>
              <td>
                <code class="docs-sig">{r.sig}</code>
              </td>
              <td>{r.note}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Section(props: {
  id: string;
  title: string;
  children: unknown;
}) {
  return (
    <section id={props.id} class="docs-section">
      <Text as="h2" size="xl" class="docs-h2">
        {props.title}
      </Text>
      {props.children as never}
    </section>
  );
}

export function DocsPage(props: { router: Router }) {
  const { router } = props;
  const go = (path: string) => () => router.navigate(path);

  const sectionNav = createSectionNav(DOC_SECTIONS);
  sectionNav.bindScrollSpy();
  queueMicrotask(() => sectionNav.initFromHash());

  const tocBtn = (id: string, label: string) => (
    <button
      type="button"
      class={tocActiveClass(sectionNav.activeId, id)}
      onClick={() => sectionNav.scrollTo(id)}
    >
      {label}
    </button>
  );

  return (
    <Container size="xl">
      <Stack gap={8}>
        <Stack gap={3}>
          <Badge tone="accent">Guide + API</Badge>
          <Text as="h1" size="2xl">
            How to use Power UX
          </Text>
          <Text muted>
            This page is the developer entry point: install, three rules, a
            first app, then a package-by-package API cheat sheet. Lab and System
            are for practice and browsing components — start here if you’re new.
          </Text>
          <Stack direction="row" gap={2} wrap>
            <Button onClick={go("/lab")}>Practice in Lab</Button>
            <Button variant="soft" onClick={go("/system")}>
              Browse components
            </Button>
            <a
              class="docs-demo-link"
              href="http://localhost:5180"
              target="_blank"
              rel="noreferrer"
            >
              designlab206 demo →
            </a>
            <a
              class="docs-demo-link"
              href="http://localhost:5181"
              target="_blank"
              rel="noreferrer"
            >
              Hearth restaurant →
            </a>
          </Stack>
        </Stack>

        <nav class="docs-toc page-toc" aria-label="On this page">
          {tocBtn("paths", "Paths")}
          {tocBtn("start", "Start")}
          {tocBtn("rules", "Rules")}
          {tocBtn("first-app", "First app")}
          {tocBtn("packages", "Packages")}
          {tocBtn("patterns", "Patterns")}
          {tocBtn("api-core", "core")}
          {tocBtn("api-dom", "dom")}
          {tocBtn("api-ui", "ui")}
          {tocBtn("api-animate", "animate")}
          {tocBtn("api-router", "router")}
          {tocBtn("next", "What next")}
        </nav>

        <Section id="paths" title="0. Pick a path">
          <Grid cols={3} gap={3}>
            <Card>
              <Stack gap={2}>
                <Text weight="semibold">Engineer</Text>
                <Text size="sm" muted>
                  1) Three rules below · 2){" "}
                  <a class="docs-inline-link" href="/lab?recipe=hello">
                    Lab hello
                  </a>{" "}
                  · 3){" "}
                  <a class="docs-inline-link" href="/lab?recipe=form">
                    form
                  </a>{" "}
                  · 4) System Copy JSX
                </Text>
                <Button size="sm" onClick={go("/lab?recipe=hello")}>
                  Open Lab hello
                </Button>
              </Stack>
            </Card>
            <Card>
              <Stack gap={2}>
                <Text weight="semibold">Design / UX</Text>
                <Text size="sm" muted>
                  Tokens playground · density · Open Lab from any System card.
                  Retheme without learning signals.
                </Text>
                <Button size="sm" variant="soft" onClick={go("/system#sys-color")}>
                  Open System tokens
                </Button>
              </Stack>
            </Card>
            <Card>
              <Stack gap={2}>
                <Text weight="semibold">Cookbook</Text>
                <Text size="sm" muted>
                  Ship a screen: settings form, admin list, createField profile.
                </Text>
                <Stack direction="row" gap={2} wrap>
                  <Button size="sm" variant="ghost" onClick={go("/lab?recipe=settings")}>
                    Settings
                  </Button>
                  <Button size="sm" variant="ghost" onClick={go("/lab?recipe=admin-list")}>
                    Admin list
                  </Button>
                </Stack>
              </Stack>
            </Card>
          </Grid>
          <Text size="sm" muted class="docs-mt">
            Day 1 / Day 2 / Day 30 learning: monorepo{" "}
            <Code>docs/LEARN_PATH.md</Code> · Motion language:{" "}
            <Code>docs/MOTION.md</Code>
          </Text>
        </Section>

        <Section id="start" title="1. Install & import">
          <Alert tone="info" title="Local monorepo today">
            Packages are workspace-linked while the repo is private. After
            publish you’ll use the same names on npm.
          </Alert>
          <Text size="sm" muted>
            Product demos (run from monorepo root):
          </Text>
          <pre class="docs-pre">{`pnpm example:starter     # designlab206 workspace  → http://localhost:5180
pnpm example:restaurant  # Hearth restaurant   → http://localhost:5181
pnpm example:browser     # Docs / Lab / System  → http://localhost:5173
pnpm ci                  # typecheck · test · size budgets`}</pre>
          <Text size="sm" muted>
            Full first-screen walkthrough: monorepo{" "}
            <Code>docs/GOLDEN_PATH.md</Code> (forms that type correctly +
            theme).
          </Text>
          <pre class="docs-pre">{`pnpm add @power-ux/core @power-ux/dom @power-ux/ui

# optional
pnpm add @power-ux/animate @power-ux/router
# pro motion (optional peer)
pnpm add gsap   # then: import from "@power-ux/animate/gsap"`}</pre>
          <Text size="sm" muted>
            Always import the theme once at the app root:
          </Text>
          <pre class="docs-pre">{`import "@power-ux/ui/theme.css";`}</pre>
        </Section>

        <Section id="rules" title="2. Three rules (memorize these)">
          <Grid cols={1} gap={3}>
            <Card>
              <Stack gap={2}>
                <Text weight="semibold">1. Signals are functions</Text>
                <Text size="sm" muted>
                  Read with <Code>count()</Code>. Write with{" "}
                  <Code>count.set(1)</Code> or{" "}
                  <Code>{"count.update(n => n + 1)"}</Code>.
                </Text>
              </Stack>
            </Card>
            <Card>
              <Stack gap={2}>
                <Text weight="semibold">2. Live UI needs an accessor</Text>
                <Text size="sm" muted>
                  In JSX use <Code>{"{() => count()}"}</Code> so the binding
                  re-runs. <Code>{"{count()}"}</Code> is a one-time snapshot.
                </Text>
              </Stack>
            </Card>
            <Card>
              <Stack gap={2}>
                <Text weight="semibold">3. Look + behavior ship together</Text>
                <Text size="sm" muted>
                  Prefer <Code>Button</Code> / <Code>Stack</Code> /{" "}
                  <Code>Card</Code> over raw HTML + ad-hoc CSS. Retheme via{" "}
                  <Code>tokens.css</Code>, not per-component hacks.
                </Text>
              </Stack>
            </Card>
          </Grid>
        </Section>

        <Section id="first-app" title="3. First app (copy-paste)">
          <Text muted size="sm">
            Vite / TS: set{" "}
            <Code>{`"jsx": "react-jsx", "jsxImportSource": "@power-ux/dom"`}</Code>{" "}
            in <Code>tsconfig</Code>.
          </Text>
          <pre class="docs-pre">{`import "@power-ux/ui/theme.css";
import { signal } from "@power-ux/core";
import { mount } from "@power-ux/dom";
import { Button, Card, Stack, Text, createTheme } from "@power-ux/ui";

createTheme("light").bind();

const count = signal(0);

mount(document.getElementById("app")!, () => (
  <Card>
    <Stack gap={3}>
      <Text as="h1" size="xl">Hello</Text>
      <Text muted>Clicks: {() => count()}</Text>
      <Button onClick={() => count.update((n) => n + 1)}>
        Click me
      </Button>
    </Stack>
  </Card>
));`}</pre>
          <Text size="sm">
            Prefer the form-shaped path in{" "}
            <Code>docs/GOLDEN_PATH.md</Code> (controlled{" "}
            <Code>{"value={email}"}</Code>, not{" "}
            <Code>{"value={email()}"}</Code>). Then open <strong>Lab</strong>{" "}
            recipes 01→10 — each has Goal / Learn / How / Try this.
          </Text>
        </Section>

        <Section id="packages" title="4. Package map">
          <div class="docs-table-wrap">
            <table class="docs-table">
              <thead>
                <tr>
                  <th>Package</th>
                  <th>You use it for</th>
                  <th>Import when…</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <code>@power-ux/core</code>
                  </td>
                  <td>State & reactivity</td>
                  <td>Always (signals)</td>
                </tr>
                <tr>
                  <td>
                    <code>@power-ux/dom</code>
                  </td>
                  <td>Mount, JSX, Show/For</td>
                  <td>Always (UI tree)</td>
                </tr>
                <tr>
                  <td>
                    <code>@power-ux/ui</code>
                  </td>
                  <td>Theme + components</td>
                  <td>Almost always</td>
                </tr>
                <tr>
                  <td>
                    <code>@power-ux/animate</code>
                  </td>
                  <td>Tween / spring on signals</td>
                  <td>Motion needed</td>
                </tr>
                <tr>
                  <td>
                    <code>@power-ux/router</code>
                  </td>
                  <td>SPA routes + Link</td>
                  <td>Multi-page app</td>
                </tr>
                <tr>
                  <td>
                    <code>@power-ux/ssr</code>
                  </td>
                  <td>String render + islands</td>
                  <td>SSR / marketing HTML</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Section>

        <Section id="patterns" title="5. Common patterns (real apps)">
          <Text muted size="sm">
            These map 1:1 to Lab recipes — open Lab and run them after reading.
          </Text>
          <Grid cols={1} gap={3}>
            <Card>
              <Stack gap={2}>
                <Text weight="semibold">Async data</Text>
                <pre class="docs-pre">{`const user = resource(async () => {
  const res = await fetch("/api/me");
  return res.json();
});
// user() · user.loading() · user.error() · user.refetch()`}</pre>
                <Text size="sm" muted>
                  Lab:{" "}
                  <a class="docs-inline-link" href="/lab?recipe=async">
                    Async resource →
                  </a>
                </Text>
              </Stack>
            </Card>
            <Card>
              <Stack gap={2}>
                <Text weight="semibold">Form validation</Text>
                <pre class="docs-pre">{`const email = signal("");
const emailError = () =>
  email().includes("@") ? "" : "Invalid email";

&lt;Field label="Email" error={emailError}&gt;
  &lt;Input bind={email} /&gt;
&lt;/Field&gt;`}</pre>
                <Text size="sm" muted>
                  Lab:{" "}
                  <a class="docs-inline-link" href="/lab?recipe=form">
                    Form validation →
                  </a>
                  {" · "}
                  <a class="docs-inline-link" href="/lab?recipe=create-field">
                    createField →
                  </a>
                </Text>
              </Stack>
            </Card>
            <Card>
              <Stack gap={2}>
                <Text weight="semibold">Combobox</Text>
                <pre class="docs-pre">{`&lt;Combobox
  value={city}
  onChange={city.set}
  options={cities}
  loading={loading}
  emptyText="No cities match"
/&gt;`}</pre>
                <Text size="sm" muted>
                  System →{" "}
                  <a class="docs-inline-link" href="/system#sys-power">
                    Power
                  </a>
                  {" · "}
                  Lab:{" "}
                  <a class="docs-inline-link" href="/lab?recipe=kit">
                    Layout kit →
                  </a>
                </Text>
              </Stack>
            </Card>
            <Card>
              <Stack gap={2}>
                <Text weight="semibold">Motion (native + optional GSAP)</Text>
                <pre class="docs-pre">{`// default — no peer deps
animate(x, 100, spring());

// optional: pnpm add gsap
import { gsapAnimate } from "@power-ux/animate/gsap";
gsapAnimate(x, 100, { duration: 400, ease: "power3.out" });`}</pre>
                <Text size="sm" muted>
                  Lab:{" "}
                  <a class="docs-inline-link" href="/lab?recipe=animate">
                    Spring motion →
                  </a>
                  {" · "}
                  <a class="docs-inline-link" href="/lab?recipe=gsap">
                    GSAP adapter →
                  </a>
                </Text>
              </Stack>
            </Card>
          </Grid>
        </Section>

        <Divider label="API reference" />

        <Section id="api-core" title="@power-ux/core">
          <Text muted size="sm">
            Fine-grained graph. No DOM.
          </Text>
          <ApiTable
            rows={[
              {
                name: "signal",
                sig: "signal(0) → count() · .set · .update · .peek",
                note: "Reactive value. Call to read (tracks).",
              },
              {
                name: "computed",
                sig: "computed(() => a() + b())",
                note: "Cached derived value; pure only.",
              },
              {
                name: "effect",
                sig: "effect(() => { …; return cleanup })",
                note: "Runs when deps change. No dep arrays.",
              },
              {
                name: "store",
                sig: "store({ count: 0, name: 'Ada' })",
                note: "Per-field signals + .set batch.",
              },
              {
                name: "resource",
                sig: "resource(source, fetcher)",
                note: "Async data: loading / error / value.",
              },
              {
                name: "batch / flush",
                sig: "batch(() => { … })",
                note: "Group updates; flush for tests.",
              },
              {
                name: "createRoot",
                sig: "createRoot((dispose) => { … })",
                note: "Own effects; dispose tears down.",
              },
              {
                name: "untrack",
                sig: "untrack(() => count())",
                note: "Read without subscribing.",
              },
              {
                name: "onError",
                sig: "onError((err) => …)",
                note: "Owner-scoped error handler.",
              },
            ]}
          />
        </Section>

        <Section id="api-dom" title="@power-ux/dom">
          <Text muted size="sm">
            Mount and bind the graph to the DOM / JSX.
          </Text>
          <ApiTable
            rows={[
              {
                name: "mount",
                sig: "mount(parent, () => <App />)",
                note: "Create reactive root + append.",
              },
              {
                name: "h / JSX",
                sig: 'jsxImportSource: "@power-ux/dom"',
                note: "Automatic JSX runtime.",
              },
              {
                name: "component",
                sig: "component((props) => …)",
                note: "Reactive props via createProps.",
              },
              {
                name: "Show",
                sig: "<Show when={() => on()}>{() => …}</Show>",
                note: "Conditional mount.",
              },
              {
                name: "For",
                sig: "<For each={() => items()}>{(item) => …}</For>",
                note: "Keyed list; item() is live.",
              },
              {
                name: "bindStyle / bindText",
                sig: "bindStyle(el, () => ({ … }))",
                note: "Fine-grained DOM bindings.",
              },
              {
                name: "mergeProps",
                sig: "mergeProps(defaults, props)",
                note: "Component prop helpers.",
              },
            ]}
          />
        </Section>

        <Section id="api-ui" title="@power-ux/ui">
          <Text muted size="sm">
            Design system: tokens + primitives. Import{" "}
            <Code>theme.css</Code> once.
          </Text>
          <ApiTable
            rows={[
              {
                name: "createTheme",
                sig: 'createTheme("light").bind() · .toggle()',
                note: "data-pu-theme on <html>.",
              },
              {
                name: "createDensity",
                sig: 'createDensity("comfortable").bind()',
                note: "data-pu-density compact/comfortable.",
              },
              {
                name: "Authoring",
                sig: "createStyleSheet · styleVars · trapFocus",
                note: "Write components in minutes — see COMPONENTS.md.",
              },
              {
                name: "Layout",
                sig: "Stack · Grid · Container · Divider · AspectRatio · ScrollArea · Collapse",
                note: "Tokenized gap / width / media frames.",
              },
              {
                name: "Typography",
                sig: "Text · Code · Kbd · Link",
                note: "Type ramp + mono chips.",
              },
              {
                name: "Inputs",
                sig: "Button · Input · Textarea · Select · Field · Label · Switch · Checkbox · RadioGroup · Slider · NumberInput · ToggleGroup · Combobox",
                note: "Forms + actions + pickers.",
              },
              {
                name: "Surfaces",
                sig: "Card · Badge · Chip · Avatar · Alert · Spinner · Progress · Skeleton · Empty · Stat",
                note: "Status, KPIs, empty states.",
              },
              {
                name: "Structure",
                sig: "Tabs · Accordion · Breadcrumb · Pagination · Steps · Timeline · List · Table",
                note: "More structure than Bootstrap.",
              },
              {
                name: "Overlays",
                sig: "Dialog · Drawer · Tooltip · Popover · Menu · Toaster",
                note: "Focus trap + Esc; createToaster().",
              },
              {
                name: "Motion",
                sig: "Transition · Collapse",
                note: "Enter/exit CSS; animate package for springs.",
              },
              {
                name: "Retheme",
                sig: "packages/ui/src/styles/tokens.css",
                note: "Brand blues + green #69BE28.",
              },
            ]}
          />
          <Text size="sm" muted>
            Live gallery of every primitive:{" "}
            <Button size="sm" variant="soft" onClick={go("/system")}>
              Open System
            </Button>
            {" · "}
            Author new ones: <Code>docs/COMPONENTS.md</Code>
          </Text>
        </Section>

        <Section id="api-animate" title="@power-ux/animate">
          <ApiTable
            rows={[
              {
                name: "animate",
                sig: "animate(signal, to, { duration, ease })",
                note: "Tween a number signal (default — no GSAP).",
              },
              {
                name: "spring",
                sig: "animate(x, 100, spring({ stiffness, damping }))",
                note: "Physics-ish options.",
              },
              {
                name: "cancel",
                sig: "cancel(signal)",
                note: "Stop in-flight animation.",
              },
              {
                name: "gsapAnimate",
                sig: 'import { gsapAnimate } from "@power-ux/animate/gsap"',
                note: "Optional peer gsap. Duration in ms.",
              },
            ]}
          />
        </Section>

        <Section id="api-router" title="@power-ux/router">
          <ApiTable
            rows={[
              {
                name: "createRouter",
                sig: "createRouter({ routes, mode? })",
                note: "history | hash | memory.",
              },
              {
                name: "router.outlet",
                sig: "{router.outlet()}",
                note: "Render matched route.",
              },
              {
                name: "router.navigate",
                sig: 'router.navigate("/path")',
                note: "Programmatic nav.",
              },
              {
                name: "Link",
                sig: '<Link router={r} to="/lab">Lab</Link>',
                note: "Declarative link + activeClass.",
              },
            ]}
          />
        </Section>

        <Section id="next" title="6. Recommended path for new devs">
          <ol class="docs-steps">
            <li>
              <strong>This page</strong> — rules + first app + patterns + API
            </li>
            <li>
              <strong>Lab</strong> — recipes with Goal / Try this (
              <Kbd>⌘</Kbd>
              <Kbd>↵</Kbd> to run). Don’t skip <strong>Async</strong> +{" "}
              <strong>Form</strong>.
            </li>
            <li>
              <strong>System</strong> — click every primitive, toggle theme /
              density
            </li>
            <li>
              <strong>Demos</strong> — designlab206 (:5180) + Hearth (:5181) for
              real product patterns
            </li>
            <li>
              Repo markdown: <Code>docs/GOLDEN_PATH.md</Code>,{" "}
              <Code>docs/LEARN.md</Code>, <Code>docs/FOUNDATION.md</Code>,{" "}
              <Code>docs/STABLE.md</Code>
            </li>
          </ol>
          <Stack direction="row" gap={2} wrap>
            <Button onClick={go("/lab")}>Go to Lab</Button>
            <Button variant="soft" onClick={go("/system")}>
              Go to System
            </Button>
            <a
              class="docs-demo-link"
              href="http://localhost:5180"
              target="_blank"
              rel="noreferrer"
            >
              designlab206 →
            </a>
            <a
              class="docs-demo-link"
              href="http://localhost:5181"
              target="_blank"
              rel="noreferrer"
            >
              Hearth →
            </a>
          </Stack>
        </Section>
      </Stack>
    </Container>
  );
}
