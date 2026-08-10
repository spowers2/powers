/**
 * In-app docs: how to start + API reference.
 * Markdown lives in /docs for repo readers; this is what demo visitors actually see.
 */
import type { Router } from "@power-ui/router";
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
} from "@power-ui/ui";
import "./docs.css";

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

  return (
    <Container size="lg">
      <Stack gap={8}>
        <Stack gap={3}>
          <Badge tone="accent">Guide + API</Badge>
          <Text as="h1" size="2xl">
            How to use Power UI
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
          </Stack>
        </Stack>

        <nav class="docs-toc" aria-label="On this page">
          <a href="#start">Start</a>
          <a href="#rules">Rules</a>
          <a href="#first-app">First app</a>
          <a href="#packages">Packages</a>
          <a href="#api-core">core</a>
          <a href="#api-dom">dom</a>
          <a href="#api-ui">ui</a>
          <a href="#api-animate">animate</a>
          <a href="#api-router">router</a>
          <a href="#next">What next</a>
        </nav>

        <Section id="start" title="1. Install & import">
          <Alert tone="info" title="Local monorepo today">
            Packages are workspace-linked while the repo is private. After
            publish you’ll use the same names on npm.
          </Alert>
          <pre class="docs-pre">{`pnpm add @power-ui/core @power-ui/dom @power-ui/ui

# optional
pnpm add @power-ui/animate @power-ui/router`}</pre>
          <Text size="sm" muted>
            Always import the theme once at the app root:
          </Text>
          <pre class="docs-pre">{`import "@power-ui/ui/theme.css";`}</pre>
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
            <Code>{`"jsx": "react-jsx", "jsxImportSource": "@power-ui/dom"`}</Code>{" "}
            in <Code>tsconfig</Code>.
          </Text>
          <pre class="docs-pre">{`import "@power-ui/ui/theme.css";
import { signal } from "@power-ui/core";
import { mount } from "@power-ui/dom";
import { Button, Card, Stack, Text, createTheme } from "@power-ui/ui";

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
            Then open <strong>Lab</strong> and work through recipes 01→10 — each
            has Goal / Learn / How / Try this.
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
                    <code>@power-ui/core</code>
                  </td>
                  <td>State & reactivity</td>
                  <td>Always (signals)</td>
                </tr>
                <tr>
                  <td>
                    <code>@power-ui/dom</code>
                  </td>
                  <td>Mount, JSX, Show/For</td>
                  <td>Always (UI tree)</td>
                </tr>
                <tr>
                  <td>
                    <code>@power-ui/ui</code>
                  </td>
                  <td>Theme + components</td>
                  <td>Almost always</td>
                </tr>
                <tr>
                  <td>
                    <code>@power-ui/animate</code>
                  </td>
                  <td>Tween / spring on signals</td>
                  <td>Motion needed</td>
                </tr>
                <tr>
                  <td>
                    <code>@power-ui/router</code>
                  </td>
                  <td>SPA routes + Link</td>
                  <td>Multi-page app</td>
                </tr>
                <tr>
                  <td>
                    <code>@power-ui/ssr</code>
                  </td>
                  <td>String render + islands</td>
                  <td>SSR / marketing HTML</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Section>

        <Divider label="API reference" />

        <Section id="api-core" title="@power-ui/core">
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

        <Section id="api-dom" title="@power-ui/dom">
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
                sig: 'jsxImportSource: "@power-ui/dom"',
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

        <Section id="api-ui" title="@power-ui/ui">
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
                name: "Layout",
                sig: "Stack · Grid · Container · Divider",
                note: "Tokenized gap / width.",
              },
              {
                name: "Typography",
                sig: "Text · Code · Kbd",
                note: "Type ramp + mono chips.",
              },
              {
                name: "Inputs",
                sig: "Button · Input · Textarea · Select · Field · Label · Switch · Checkbox",
                note: "Forms + actions.",
              },
              {
                name: "Surfaces",
                sig: "Card · Badge · Avatar · Alert · Spinner · Progress · Skeleton",
                note: "Status & feedback.",
              },
              {
                name: "Overlays",
                sig: "Dialog · Tabs · Tooltip · Popover · Menu · Toaster",
                note: "createToaster() for toasts.",
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
          </Text>
        </Section>

        <Section id="api-animate" title="@power-ui/animate">
          <ApiTable
            rows={[
              {
                name: "animate",
                sig: "animate(signal, to, { duration, ease })",
                note: "Tween a number signal.",
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
            ]}
          />
        </Section>

        <Section id="api-router" title="@power-ui/router">
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

        <Section id="next" title="5. Recommended path for new devs">
          <ol class="docs-steps">
            <li>
              <strong>This page</strong> — rules + first app + API tables
            </li>
            <li>
              <strong>Lab</strong> — recipes 01→10 with Goal / Try this (
              <Kbd>⌘</Kbd>
              <Kbd>↵</Kbd> to run)
            </li>
            <li>
              <strong>System</strong> — click every primitive, toggle theme /
              density
            </li>
            <li>
              <strong>Todos</strong> — small multi-component app
            </li>
            <li>
              Repo markdown (when reading the monorepo):{" "}
              <Code>docs/LEARN.md</Code>, <Code>docs/API.md</Code>,{" "}
              <Code>docs/STYLING.md</Code>
            </li>
          </ol>
          <Stack direction="row" gap={2} wrap>
            <Button onClick={go("/lab")}>Go to Lab</Button>
            <Button variant="soft" onClick={go("/system")}>
              Go to System
            </Button>
            <Button variant="ghost" onClick={go("/todos")}>
              Go to Todos
            </Button>
          </Stack>
        </Section>
      </Stack>
    </Container>
  );
}
