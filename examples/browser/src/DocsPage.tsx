/**
 * In-app docs: how to start + API reference.
 * Markdown lives in /docs for repo readers; this is what demo visitors actually see.
 */
import type { Router } from "@lab206/router";
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
} from "@lab206/ui";
import { createSectionNav, tocActiveClass } from "./scrollNav.js";
import { SITE } from "./siteConfig.js";
import "./docs.css";

const DOC_SECTIONS = [
  "paths",
  "start",
  "rules",
  "reactivity",
  "first-app",
  "packages",
  "patterns",
  "data",
  "api-core",
  "api-dom",
  "api-ui",
  "api-animate",
  "api-router",
  "public-sector",
  "licensing",
  "pro",
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
            How to use Powers
          </Text>
          <Text muted>
            Install, three rules, the five reactivity words in plain English,
            a first app, then the API cheat sheet. Same terms for designers and
            developers —{" "}
            <Code>signal</Code>, <Code>computed</Code>, <Code>effect</Code>,{" "}
            <Code>store</Code>, <Code>resource</Code> — explained so an outsider
            gets them the first time. Lab and System are for practice. Designers:
            also install{" "}
            <a
              href={SITE.figma.pluginUrl}
              target="_blank"
              rel="noreferrer"
            >
              {SITE.figma.pluginLabel}
            </a>{" "}
            from Figma Community. Questions?{" "}
            <a class="docs-inline-link" href={SITE.contact.href}>
              {SITE.contact.label}
            </a>{" "}
            or a{" "}
            <a
              class="docs-inline-link"
              href={SITE.contact.githubIssues}
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub issue
            </a>
            .
          </Text>
          <Stack direction="row" gap={2} wrap>
            <Button onClick={go("/lab")}>Practice in Lab</Button>
            <Button variant="soft" onClick={go("/system")}>
              Browse components
            </Button>
            <Button variant="ghost" onClick={go(SITE.contact.href)}>
              {SITE.contact.label} →
            </Button>
            <a
              class="docs-demo-link"
              href={SITE.demos.workspace.href}
              {...SITE.demoLinkAttrs}
            >
              {SITE.demos.workspace.label} demo →
            </a>
            <a
              class="docs-demo-link"
              href={SITE.demos.hearth.href}
              {...SITE.demoLinkAttrs}
            >
              {SITE.demos.hearth.label} →
            </a>
          </Stack>
        </Stack>

        <nav class="docs-toc page-toc" aria-label="On this page">
          {tocBtn("paths", "Paths")}
          {tocBtn("start", "Start")}
          {tocBtn("rules", "Rules")}
          {tocBtn("reactivity", "Five words")}
          {tocBtn("first-app", "First app")}
          {tocBtn("packages", "Packages")}
          {tocBtn("patterns", "Patterns")}
          {tocBtn("data", "Data")}
          {tocBtn("api-core", "core")}
          {tocBtn("api-dom", "dom")}
          {tocBtn("api-ui", "ui")}
          {tocBtn("api-animate", "animate")}
          {tocBtn("api-router", "router")}
          {tocBtn("public-sector", "Public sector")}
          {tocBtn("licensing", "Licensing")}
          {tocBtn("pro", "Pro pack")}
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
                  1){" "}
                  <a class="docs-inline-link" href="#reactivity">
                    Five words
                  </a>{" "}
                  (10 min) · 2) System tokens · 3) Open Lab from any card. Same
                  vocabulary as eng — no mystery jargon.
                </Text>
                <Button
                  size="sm"
                  variant="soft"
                  onClick={() => sectionNav.scrollTo("reactivity")}
                >
                  Read five words
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
          <Alert tone="info" title="Under 10 minutes">
            Scaffold a Vite app with form + theme, or add packages to an
            existing project. Live demos stay on this site.
          </Alert>
          <Text size="sm" muted>
            Scaffold (recommended):
          </Text>
          <pre class="docs-pre">{`pnpm create powers my-app
cd my-app && pnpm install && pnpm dev
# → http://localhost:5190`}</pre>
          <Text size="sm" muted>
            Or add to an existing Vite app:
          </Text>
          <pre class="docs-pre">{`pnpm add @lab206/core @lab206/dom @lab206/ui

# optional
pnpm add @lab206/animate @lab206/router
# pro motion (optional peer)
pnpm add gsap   # then: import from "@lab206/animate/gsap"`}</pre>
          <Text size="sm" muted>
            Always import the theme once at the app root:
          </Text>
          <pre class="docs-pre">{`import "@lab206/ui/theme.css";`}</pre>
          <Text size="sm" muted>
            From source (contributors):{" "}
            <Code>pnpm example:browser</Code> ·{" "}
            <Code>pnpm example:starter</Code> ·{" "}
            <Code>pnpm example:restaurant</Code>
          </Text>
        </Section>

        <Section id="rules" title="2. Three rules (memorize these)">
          <Grid cols={1} gap={3}>
            <Card>
              <Stack gap={2}>
                <Text weight="semibold">1. Signals are functions</Text>
                <Text size="sm" muted>
                  A <strong>signal</strong> is a live value. Read with{" "}
                  <Code>count()</Code>. Write with <Code>count.set(1)</Code> or{" "}
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

        <Section id="reactivity" title="2b. Five words (designers + developers)">
          <Text muted>
            Industry names Powers uses in code — explained so you get them the
            first time. Full write-up in the repo:{" "}
            <Code>docs/LEARN.md</Code>.
          </Text>
          <Text size="sm" muted>
            One sentence: a <strong>signal</strong> holds a changing value; a{" "}
            <strong>computed</strong> is a formula; an <strong>effect</strong> is
            a reaction; a <strong>store</strong> groups related values; a{" "}
            <strong>resource</strong> is data that loads. Powers updates only
            what depended on the change.
          </Text>
          <div class="docs-table-wrap">
            <table class="docs-table">
              <thead>
                <tr>
                  <th>In code</th>
                  <th>Plain English</th>
                  <th>Designer analogy</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <Code>signal</Code>
                  </td>
                  <td>Live value</td>
                  <td>Prototype variable / updating component property</td>
                </tr>
                <tr>
                  <td>
                    <Code>computed</Code>
                  </td>
                  <td>Formula</td>
                  <td>
                    Spreadsheet cell · <Code>fullName = first + last</Code>
                  </td>
                </tr>
                <tr>
                  <td>
                    <Code>effect</Code>
                  </td>
                  <td>Reaction</td>
                  <td>Prototype: when X changes → do Y</td>
                </tr>
                <tr>
                  <td>
                    <Code>store</Code>
                  </td>
                  <td>Small model</td>
                  <td>Form state bag (name, email, errors)</td>
                </tr>
                <tr>
                  <td>
                    <Code>resource</Code>
                  </td>
                  <td>Loaded data</td>
                  <td>Loading → content or error</td>
                </tr>
              </tbody>
            </table>
          </div>
          <Text size="sm" muted>
            Keep the code names in PRs and Lab. Use the plain-English column when
            onboarding someone new. Practice:{" "}
            <a class="docs-inline-link" href="/lab?recipe=hello">
              Lab hello
            </a>
            .
          </Text>
        </Section>

        <Section id="first-app" title="3. First app (copy-paste)">
          <Alert tone="info" title="Prefer the scaffold">
            <Code>pnpm create powers my-app</Code> wires Vite + TS for you. If
            you hand-roll, you need <strong>both</strong> configs below —{" "}
            <Code>react-jsx</Code> is only the transform name; do{" "}
            <strong>not</strong> install React. Use <Code>@lab206/*@0.1.6+</Code>
            .
          </Alert>
          <Text muted size="sm">
            <Code>tsconfig.json</Code> — TypeScript:
          </Text>
          <pre class="docs-pre">{`{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "@lab206/dom"
  }
}`}</pre>
          <Text muted size="sm">
            <Code>vite.config.ts</Code> — Vite does not read tsconfig for JSX:
          </Text>
          <pre class="docs-pre">{`import { defineConfig } from "vite";

export default defineConfig({
  esbuild: {
    jsx: "automatic",
    jsxImportSource: "@lab206/dom",
  },
  optimizeDeps: {
    include: ["@lab206/core", "@lab206/dom", "@lab206/ui"],
  },
});`}</pre>
          <Text muted size="sm">
            App entry:
          </Text>
          <pre class="docs-pre">{`import "@lab206/ui/theme.css";
import { signal } from "@lab206/core";
import { mount } from "@lab206/dom";
import { Button, Card, Stack, Text, createTheme } from "@lab206/ui";

createTheme("light").bind();

const count = signal(0);

mount(document.getElementById("root")!, () => (
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
                    <code>@lab206/core</code>
                  </td>
                  <td>State & reactivity</td>
                  <td>Always (signals)</td>
                </tr>
                <tr>
                  <td>
                    <code>@lab206/dom</code>
                  </td>
                  <td>Mount, JSX, Show/For</td>
                  <td>Always (UI tree)</td>
                </tr>
                <tr>
                  <td>
                    <code>@lab206/ui</code>
                  </td>
                  <td>Theme + components</td>
                  <td>Almost always</td>
                </tr>
                <tr>
                  <td>
                    <code>@lab206/animate</code>
                  </td>
                  <td>Tween / spring on signals</td>
                  <td>Motion needed</td>
                </tr>
                <tr>
                  <td>
                    <code>@lab206/router</code>
                  </td>
                  <td>SPA routes + Link</td>
                  <td>Multi-page app</td>
                </tr>
                <tr>
                  <td>
                    <code>@lab206/ssr</code>
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

<Field label="Email" error={emailError}>
  <Input bind={email} />
</Field>`}</pre>
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
                <pre class="docs-pre">{`<Combobox
  bind={city}
  options={cities}
  loading={loading}
  emptyText="No cities match"
/>`}</pre>
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
import { gsapAnimate } from "@lab206/animate/gsap";
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

        <Section id="data" title="5b. Data — hook any backend">
          <Text muted>
            Powers is the interface layer. Your REST / BaaS / GraphQL client stays
            yours — no Powers server, no Swagger product. Full playbook:{" "}
            <Code>docs/DATA.md</Code>.
          </Text>
          <Text size="sm" muted>
            Read with <Code>resource</Code> / <Code>createQuery</Code>. Share{" "}
            <Code>baseUrl</Code> + auth via <Code>createApiClient</Code>. Drive
            Spinner · Alert · Empty from loading / error / data.
          </Text>
          <pre class="docs-pre">{`import { createApiClient, createQuery, signal } from "@lab206/core";

const token = signal<string | null>(null);
const api = createApiClient({
  baseUrl: "/api",
  getHeaders: () =>
    token() ? { Authorization: \`Bearer \${token()}\` } : {},
});

const list = createQuery({
  queryKey: () => "items",
  queryFn: () => api.get("/items"),
});
// list.loading() · list.error() · list() · list.refetch()`}</pre>
          <Stack direction="row" gap={2} wrap>
            <Button size="sm" variant="soft" onClick={go("/lab?recipe=data-list")}>
              Lab: list
            </Button>
            <Button size="sm" variant="soft" onClick={go("/lab?recipe=data-detail")}>
              Lab: detail
            </Button>
            <Button size="sm" variant="soft" onClick={go("/lab?recipe=data-form")}>
              Lab: save form
            </Button>
            <Button size="sm" variant="ghost" onClick={go("/lab?recipe=async")}>
              Lab: async
            </Button>
          </Stack>
        </Section>

        <Divider label="API reference" />

        <Section id="api-core" title="@lab206/core">
          <Text muted size="sm">
            Fine-grained graph. No DOM. Plain meanings:{" "}
            <a class="docs-inline-link" href="#reactivity">
              Five words
            </a>
            . Backend:{" "}
            <a class="docs-inline-link" href="#data">
              Data
            </a>
            .
          </Text>
          <ApiTable
            rows={[
              {
                name: "signal",
                sig: "signal(0) → count() · .set · .update · .peek",
                note: "Live value. Call to read (tracks).",
              },
              {
                name: "computed",
                sig: "computed(() => a() + b())",
                note: "Formula — cached derived value; pure only.",
              },
              {
                name: "effect",
                sig: "effect(() => { …; return cleanup })",
                note: "Reaction when deps change. No dep arrays.",
              },
              {
                name: "store",
                sig: "store({ count: 0, name: 'Ada' })",
                note: "Small model — per-field signals + .set batch.",
              },
              {
                name: "resource",
                sig: "resource(source, fetcher)",
                note: "Loaded data: loading / error / value.",
              },
              {
                name: "createQuery",
                sig: "createQuery({ queryKey, queryFn })",
                note: "Signal-keyed resource — great for lists/detail.",
              },
              {
                name: "createApiClient",
                sig: "createApiClient({ baseUrl, getHeaders? })",
                note: "JSON HTTP · get/post/… · throws ApiError.",
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

        <Section id="api-dom" title="@lab206/dom">
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
                sig: 'jsxImportSource: "@lab206/dom"',
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

        <Section id="api-ui" title="@lab206/ui">
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

        <Section id="api-animate" title="@lab206/animate">
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
                sig: 'import { gsapAnimate } from "@lab206/animate/gsap"',
                note: "Optional peer gsap. Duration in ms.",
              },
            ]}
          />
        </Section>

        <Section id="api-router" title="@lab206/router">
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

        <Section id="public-sector" title="Public sector">
          <Stack gap={2}>
            <Text muted>
              Powers also fits teams building portals, case tools, and internal
              ops UIs for public-sector and regulated environments — same Figma
              kit and components as everyone else. Deploy on the customer’s host;
              wire their identity and compliance stack around the app.
            </Text>
            <Text size="sm" muted>
              Practical notes: <Code>docs/GOVERNMENT.md</Code> ·{" "}
              <Code>docs/DEPLOY.md</Code> · <Code>SECURITY.md</Code>.
            </Text>
          </Stack>
        </Section>

        <Section id="licensing" title="License & commercial">
          <Stack gap={3}>
            <Alert tone="info" title="BSL-1.1 · source-available">
              Building apps and client work with Powers is free. Shipping a
              competing UI kit / design system based on Powers needs a
              commercial license.
            </Alert>
            <Text size="sm" muted>
              Indicative commercial: Indie <strong>$299/yr</strong> · Studio{" "}
              <strong>$1,499/yr</strong> · Enterprise custom. See{" "}
              <a class="docs-inline-link" href="#pro">
                Powers Pro
              </a>{" "}
              for the paid design pack.
            </Text>
            <Stack direction="row" gap={2} wrap>
              <Button onClick={go(SITE.contact.commercialHref)}>
                Inquire — commercial license
              </Button>
              <Button variant="soft" onClick={() => sectionNav.scrollTo("pro")}>
                What’s in Pro
              </Button>
            </Stack>
            <Text size="sm" muted>
              Details: <Code>docs/COMMERCIAL.md</Code> ·{" "}
              <Code>LICENSE-COMMERCIAL.md</Code>
            </Text>
          </Stack>
        </Section>

        <Section id="pro" title="Powers Pro — what’s included">
          <Stack gap={4}>
            <Text muted>
              Paid <strong>design + handoff</strong> pack (separate from free
              BSL code on npm). Indicative <strong>$149</strong> one-time ·
              checkout not self-serve yet — inquire and we’ll follow up.
            </Text>
            <Grid cols={2} gap={3}>
              <Card>
                <Stack gap={2}>
                  <Text weight="semibold">Pattern recipes</Text>
                  <Text size="sm" muted>
                    Figma build specs from kit instances: sign-in, sign-up,
                    forgot password, settings hub, admin list, billing /
                    invoices, dashboard, empty / error / loading shells.
                  </Text>
                </Stack>
              </Card>
              <Card>
                <Stack gap={2}>
                  <Text weight="semibold">Pro themes</Text>
                  <Text size="sm" muted>
                    Drop-in overlays beyond free dual/instrument:{" "}
                    <strong>Slate</strong>, <strong>Warm</strong>,{" "}
                    <strong>Mono</strong> — CSS for apps + token JSON for Figma
                    Variables.
                  </Text>
                </Stack>
              </Card>
              <Card>
                <Stack gap={2}>
                  <Text weight="semibold">Handoff pack</Text>
                  <Text size="sm" muted>
                    Client delivery checklist and quality gates so design → eng
                    stays aligned with Powers primitives.
                  </Text>
                </Stack>
              </Card>
              <Card>
                <Stack gap={2}>
                  <Text weight="semibold">Starter maps</Text>
                  <Text size="sm" muted>
                    Screen → route maps for designlab206-class and Hearth-class
                    product UIs (matches the live demos).
                  </Text>
                </Stack>
              </Card>
              <Card>
                <Stack gap={2}>
                  <Text weight="semibold">Catalog exports</Text>
                  <Text size="sm" muted>
                    Snapshot of token exports + component catalog for offline
                    reference in the zip.
                  </Text>
                </Stack>
              </Card>
              <Card>
                <Stack gap={2}>
                  <Text weight="semibold">Private Figma (after purchase)</Text>
                  <Text size="sm" muted>
                    Optional kit file duplicate + invite to your Figma email —
                    fulfilled manually with the zip, not inside Community.
                  </Text>
                </Stack>
              </Card>
            </Grid>
            <Text size="sm" muted>
              <strong>Not included:</strong> hosting / “publish my site,” or a
              Pro-only Figma plugin build (roadmap). Core <Code>@lab206/*</Code>{" "}
              stays free under BSL.
            </Text>
            <Stack direction="row" gap={2} wrap>
              <Button
                onClick={go("/contact?subject=Powers%20Pro%20(notify%20me)")}
              >
                Ask about Pro
              </Button>
              <Button variant="soft" onClick={go(SITE.contact.commercialHref)}>
                Commercial license instead
              </Button>
            </Stack>
          </Stack>
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
              <strong>Demos</strong> — {SITE.demos.workspace.label} +{" "}
              {SITE.demos.hearth.label} for real product patterns
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
              href={SITE.demos.workspace.href}
              {...SITE.demoLinkAttrs}
            >
              {SITE.demos.workspace.label} →
            </a>
            <a
              class="docs-demo-link"
              href={SITE.demos.hearth.href}
              {...SITE.demoLinkAttrs}
            >
              {SITE.demos.hearth.label} →
            </a>
          </Stack>
        </Section>
      </Stack>
    </Container>
  );
}
