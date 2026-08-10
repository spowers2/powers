export interface Recipe {
  id: string;
  title: string;
  blurb: string;
  /** Teaching tip shown beside the editor */
  tip: string;
  code: string;
}

export const recipes: Recipe[] = [
  {
    id: "hello",
    title: "Hello Power UI",
    blurb: "Mount a button in under 10 lines",
    tip: "Read signals by calling them: count(). Update with .set or .update. Children stay live with {() => …}.",
    code: `import { signal } from "@power-ui/core";
import { mount } from "@power-ui/dom";

const count = signal(0);

export function App() {
  return (
    <div style={{ fontFamily: "system-ui", padding: 24 }}>
      <h1>Hello Power UI</h1>
      <p>Clicks: {() => count()}</p>
      <button type="button" onClick={() => count.update((n) => n + 1)}>
        Click me
      </button>
    </div>
  );
}

mount(document.getElementById("root")!, () => <App />);
`,
  },
  {
    id: "computed",
    title: "Computed values",
    blurb: "Derive state without re-render soup",
    tip: "computed() caches until its dependencies change. No dependency arrays.",
    code: `import { signal, computed } from "@power-ui/core";
import { mount } from "@power-ui/dom";

const price = signal(42);
const qty = signal(2);
const total = computed(() => price() * qty());

export function App() {
  return (
    <div style={{ fontFamily: "system-ui", padding: 24, display: "grid", gap: 12 }}>
      <label>
        Price{" "}
        <input
          type="number"
          value={() => price()}
          onInput={(e) => price.set(Number((e.target as HTMLInputElement).value))}
        />
      </label>
      <label>
        Qty{" "}
        <input
          type="number"
          value={() => qty()}
          onInput={(e) => qty.set(Number((e.target as HTMLInputElement).value))}
        />
      </label>
      <strong>Total: {() => total()}</strong>
    </div>
  );
}

mount(document.getElementById("root")!, () => <App />);
`,
  },
  {
    id: "animate",
    title: "Spring motion",
    blurb: "Animate signals, not the whole tree",
    tip: "animate() tweens a number signal. Bind it to style once — only that binding updates.",
    code: `import { signal } from "@power-ui/core";
import { animate, spring } from "@power-ui/animate";
import { mount, bindStyle } from "@power-ui/dom";

const x = signal(0);

export function App() {
  const ball = (
    <div
      style={{
        width: 48,
        height: 48,
        borderRadius: 999,
        background: "linear-gradient(145deg,#243d56,#2c4538)",
      }}
    />
  ) as HTMLElement;

  bindStyle(ball, () => ({ transform: \`translateX(\${x()}px)\` }));

  return (
    <div style={{ fontFamily: "system-ui", padding: 24 }}>
      {ball}
      <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
        <button type="button" onClick={() => animate(x, 120, spring())}>
          Spring →
        </button>
        <button type="button" onClick={() => animate(x, 0, { duration: 250 })}>
          Back
        </button>
      </div>
    </div>
  );
}

mount(document.getElementById("root")!, () => <App />);
`,
  },
  {
    id: "list",
    title: "Keyed lists",
    blurb: "For + signals without virtual DOM churn",
    tip: "Pass a key so rows reuse DOM. item() is a live accessor for that row.",
    code: `import { signal } from "@power-ui/core";
import { mount, For } from "@power-ui/dom";

type Todo = { id: number; title: string };
let next = 1;
const todos = signal<Todo[]>([
  { id: next++, title: "Learn signals" },
  { id: next++, title: "Ship something" },
]);

export function App() {
  return (
    <div style={{ fontFamily: "system-ui", padding: 24 }}>
      <button
        type="button"
        onClick={() =>
          todos.update((t) => [...t, { id: next++, title: \`Task \${next}\` }])
        }
      >
        Add todo
      </button>
      <ul>
        <For each={() => todos()} key={(t) => t.id}>
          {(item) => (
            <li style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <span>{() => item().title}</span>
              <button
                type="button"
                onClick={() => {
                  const id = item().id;
                  todos.update((all) => all.filter((t) => t.id !== id));
                }}
              >
                ✕
              </button>
            </li>
          )}
        </For>
      </ul>
    </div>
  );
}

mount(document.getElementById("root")!, () => <App />);
`,
  },
  {
    id: "ui",
    title: "Design system",
    blurb: "Buttons & tokens without fighting CSS",
    tip: "Import @power-ui/ui primitives. Theme tokens come from tokens.css — retheme the product, not each component.",
    code: `import { signal } from "@power-ui/core";
import { mount } from "@power-ui/dom";
import { Button, Card, Stack, Text, Switch } from "@power-ui/ui";
import "@power-ui/ui/theme.css";

const on = signal(true);

export function App() {
  return (
    <div style={{ padding: 24, background: "var(--pu-color-bg)", minHeight: "100%" }}>
      <Card>
        <Stack gap={3}>
          <Text as="h2" size="xl">Power UI kit</Text>
          <Text muted>Token-driven primitives you can retheme in one file.</Text>
          <Stack direction="row" gap={2} wrap>
            <Button onClick={() => on.update((v) => !v)}>Primary</Button>
            <Button variant="soft">Soft</Button>
            <Button variant="ghost">Ghost</Button>
          </Stack>
          <Switch
            label="Enable feature"
            checked={on}
            onChange={(v) => on.set(v)}
          />
          <Text size="sm" muted>
            {() => (on() ? "On" : "Off")}
          </Text>
        </Stack>
      </Card>
    </div>
  );
}

mount(document.getElementById("root")!, () => <App />);
`,
  },
  {
    id: "feedback",
    title: "Alerts & loading",
    blurb: "Feedback primitives that match the system",
    tip: "Use Alert for messages and Spinner for in-progress work. Both follow tokens and a11y roles — no extra CSS framework.",
    code: `import { signal } from "@power-ui/core";
import { mount, Show } from "@power-ui/dom";
import { Alert, Button, Divider, Spinner, Stack } from "@power-ui/ui";
import "@power-ui/ui/theme.css";

const busy = signal(false);
const saved = signal(false);

export function App() {
  return (
    <div class="pu-p-6">
      <div class="pu-max-w-md">
        <Stack gap={4}>
          <Alert tone="info" title="Heads up">
            Power UI ships feedback components with the runtime.
          </Alert>
          <Divider label="demo" />
          <Stack direction="row" gap={3} align="center">
            <Button
              onClick={() => {
                busy.set(true);
                saved.set(false);
                setTimeout(() => {
                  busy.set(false);
                  saved.set(true);
                }, 1200);
              }}
            >
              Fake save
            </Button>
            <Show when={() => busy()}>
              {() => <Spinner label="Saving" />}
            </Show>
          </Stack>
          <Show when={() => saved() && !busy()}>
            {() => (
              <Alert tone="success" title="Saved">
                Your changes are in.
              </Alert>
            )}
          </Show>
        </Stack>
      </div>
    </div>
  );
}

mount(document.getElementById("root")!, () => <App />);
`,
  },
  {
    id: "tokens",
    title: "Tokens & utilities",
    blurb: "One look system — no separate CSS framework required",
    tip: "Power UI styles live with the runtime: tokens (contracts), primitives (Button/Card), and optional BEM-ish utilities (pu-gap-3). Edit tokens.css to rebrand. Tailwind is optional, not required.",
    code: `import { signal } from "@power-ui/core";
import { mount } from "@power-ui/dom";
import { Button, createTheme } from "@power-ui/ui";
import "@power-ui/ui/theme.css"; // tokens + base + utilities

const theme = createTheme("dark");
theme.bind();

const likes = signal(0);

export function App() {
  return (
    <div class="pu-p-6">
      <div class="pu-panel pu-max-w-md pu-mx-auto">
        <div class="pu-flex pu-flex--col pu-gap-4">
          <div>
            <div class="pu-font-bold" style={{ fontSize: "1.25rem" }}>
              Integrated styling
            </div>
            <p class="pu-text-muted pu-text-sm pu-m-0 pu-mt-2">
              Utilities like <code>pu-gap-4</code> map to design tokens.
              Primitives use the same tokens. One system.
            </p>
          </div>
          <div class="pu-flex pu-flex--row pu-items-center pu-gap-3 pu-flex--wrap">
            <Button onClick={() => likes.update((n) => n + 1)}>
              {() => \`Likes: \${likes()}\`}
            </Button>
            <Button variant="ghost" onClick={() => theme.toggle()}>
              Toggle theme
            </Button>
          </div>
          <div class="pu-surface-2 pu-rounded-md pu-p-3 pu-text-sm pu-text-muted">
            Prefer <code>Button</code> / <code>Stack</code> when you can.
            Utilities are for one-off layout — not a second framework.
          </div>
        </div>
      </div>
    </div>
  );
}

mount(document.getElementById("root")!, () => <App />);
`,
  },
  {
    id: "challenge",
    title: "Challenge: double counter",
    blurb: "Practice — make total = a + b",
    tip: "Create two signals and one computed. Show all three in the UI with inputs or buttons.",
    code: `import { signal, computed } from "@power-ui/core";
import { mount } from "@power-ui/dom";

// TODO: make total track a + b reactively
const a = signal(1);
const b = signal(2);
const total = computed(() => a() + b()); // keep or rewrite

export function App() {
  return (
    <div style={{ fontFamily: "system-ui", padding: 24 }}>
      <p>A: {() => a()} · B: {() => b()}</p>
      <p><strong>Total: {() => total()}</strong></p>
      <button type="button" onClick={() => a.update((n) => n + 1)}>+A</button>{" "}
      <button type="button" onClick={() => b.update((n) => n + 1)}>+B</button>
    </div>
  );
}

mount(document.getElementById("root")!, () => <App />);
`,
  },
];

export function recipeById(id: string): Recipe | undefined {
  return recipes.find((r) => r.id === id);
}
