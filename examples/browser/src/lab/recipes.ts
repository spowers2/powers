export interface Recipe {
  id: string;
  title: string;
  blurb: string;
  /** Teaching tip shown beside the editor */
  tip: string;
  code: string;
}

/**
 * All recipes use the design system (@power-ui/ui) so the live preview
 * looks like the product — not browser-default HTML.
 */
export const recipes: Recipe[] = [
  {
    id: "hello",
    title: "Hello Power UI",
    blurb: "Signals + Button in under 20 lines",
    tip: "Read signals by calling them: count(). Update with .set or .update. Children stay live with {() => …}. Prefer Button over raw <button>.",
    code: `import { signal } from "@power-ui/core";
import { mount } from "@power-ui/dom";
import { Button, Card, Stack, Text } from "@power-ui/ui";

const count = signal(0);

export function App() {
  return (
    <Card>
      <Stack gap={4}>
        <Text as="h2" size="xl">Hello Power UI</Text>
        <Text muted>Clicks: {() => count()}</Text>
        <Button onClick={() => count.update((n) => n + 1)}>
          Click me
        </Button>
      </Stack>
    </Card>
  );
}

mount(document.getElementById("root")!, () => <App />);
`,
  },
  {
    id: "computed",
    title: "Computed values",
    blurb: "Derive state without re-render soup",
    tip: "computed() caches until its dependencies change. No dependency arrays. Field + Input stay on-token.",
    code: `import { signal, computed } from "@power-ui/core";
import { mount } from "@power-ui/dom";
import { Button, Card, Field, Input, Stack, Text } from "@power-ui/ui";

const price = signal(42);
const qty = signal(2);
const total = computed(() => price() * qty());

export function App() {
  return (
    <Card>
      <Stack gap={4}>
        <Text as="h2" size="xl">Computed total</Text>
        <Field label="Price">
          <Input
            type="number"
            value={() => String(price())}
            onInput={(e) =>
              price.set(Number((e.target as HTMLInputElement).value) || 0)
            }
          />
        </Field>
        <Field label="Qty">
          <Input
            type="number"
            value={() => String(qty())}
            onInput={(e) =>
              qty.set(Number((e.target as HTMLInputElement).value) || 0)
            }
          />
        </Field>
        <Text weight="semibold" size="lg">
          Total: {() => total()}
        </Text>
        <Stack direction="row" gap={2}>
          <Button size="sm" variant="soft" onClick={() => qty.update((n) => n + 1)}>
            + Qty
          </Button>
          <Button size="sm" variant="ghost" onClick={() => price.update((n) => n + 1)}>
            + Price
          </Button>
        </Stack>
      </Stack>
    </Card>
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
import { mount } from "@power-ui/dom";
import { Button, Card, Stack, Text } from "@power-ui/ui";

const x = signal(0);

export function App() {
  // Size + motion in one style binding (numbers auto-get px)
  const ball = (
    <div
      style={() => ({
        width: 48,
        height: 48,
        borderRadius: 999,
        background:
          "linear-gradient(145deg, var(--pu-brand-500), var(--pu-sage-600))",
        boxShadow: "var(--pu-shadow-md)",
        transform: \`translateX(\${x()}px)\`,
      })}
    />
  );

  return (
    <Card>
      <Stack gap={4}>
        <Text as="h2" size="xl">Spring motion</Text>
        <Text muted size="sm">
          Only the ball binding re-runs — not a virtual tree.
        </Text>
        {ball}
        <Stack direction="row" gap={2} wrap>
          <Button onClick={() => animate(x, 140, spring())}>
            Spring →
          </Button>
          <Button
            variant="ghost"
            onClick={() => animate(x, 0, { duration: 250, ease: "easeOut" })}
          >
            Back
          </Button>
        </Stack>
      </Stack>
    </Card>
  );
}

mount(document.getElementById("root")!, () => <App />);
`,
  },
  {
    id: "list",
    title: "Keyed lists",
    blurb: "For + signals without virtual DOM churn",
    tip: "Pass a key so rows reuse DOM. item() is a live accessor for that row. Style rows with Card/Stack.",
    code: `import { signal } from "@power-ui/core";
import { mount, For } from "@power-ui/dom";
import { Badge, Button, Card, Stack, Text } from "@power-ui/ui";

type Todo = { id: number; title: string };
let next = 1;
const todos = signal<Todo[]>([
  { id: next++, title: "Learn signals" },
  { id: next++, title: "Ship something" },
]);

export function App() {
  return (
    <Card>
      <Stack gap={4}>
        <Stack direction="row" justify="between" align="center">
          <Text as="h2" size="xl">Todos</Text>
          <Badge tone="accent">{() => \`\${todos().length} items\`}</Badge>
        </Stack>
        <Button
          onClick={() =>
            todos.update((t) => [
              ...t,
              { id: next++, title: \`Task \${next}\` },
            ])
          }
        >
          Add todo
        </Button>
        <Stack gap={2}>
          <For each={() => todos()} key={(t) => t.id}>
            {(item) => (
              <Card padded variant="soft">
                <Stack direction="row" justify="between" align="center" gap={3}>
                  <Text>{() => item().title}</Text>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => {
                      const id = item().id;
                      todos.update((all) => all.filter((t) => t.id !== id));
                    }}
                  >
                    Remove
                  </Button>
                </Stack>
              </Card>
            )}
          </For>
        </Stack>
      </Stack>
    </Card>
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
import {
  Badge,
  Button,
  Card,
  Stack,
  Switch,
  Text,
} from "@power-ui/ui";

const enabled = signal(true);

export function App() {
  return (
    <Card variant="elevated">
      <Stack gap={4}>
        <Stack direction="row" justify="between" align="center">
          <Text as="h2" size="xl">Power UI kit</Text>
          <Badge tone="success">Tokens</Badge>
        </Stack>
        <Text muted>
          Token-driven primitives you can retheme in one file.
        </Text>
        <Stack direction="row" gap={2} wrap>
          <Button onClick={() => enabled.update((v) => !v)}>Primary</Button>
          <Button variant="soft">Soft</Button>
          <Button variant="ghost">Ghost</Button>
        </Stack>
        <Switch
          label="Enable feature"
          checked={enabled}
          onChange={(v) => enabled.set(v)}
        />
        <Text size="sm" muted>
          {() => (enabled() ? "Feature on" : "Feature off")}
        </Text>
      </Stack>
    </Card>
  );
}

mount(document.getElementById("root")!, () => <App />);
`,
  },
  {
    id: "feedback",
    title: "Alerts & loading",
    blurb: "Feedback primitives that match the system",
    tip: "Use Alert for messages and Spinner for in-progress work. Both follow tokens and a11y roles.",
    code: `import { signal } from "@power-ui/core";
import { mount, Show } from "@power-ui/dom";
import {
  Alert,
  Button,
  Card,
  Divider,
  Spinner,
  Stack,
  Text,
} from "@power-ui/ui";

const busy = signal(false);
const saved = signal(false);

export function App() {
  return (
    <Card>
      <Stack gap={4}>
        <Text as="h2" size="xl">Feedback</Text>
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
    </Card>
  );
}

mount(document.getElementById("root")!, () => <App />);
`,
  },
  {
    id: "tokens",
    title: "Tokens & utilities",
    blurb: "One look system — no separate CSS framework",
    tip: "Utilities like pu-gap-4 map to design tokens. Primitives use the same tokens. createTheme() flips light/dark.",
    code: `import { signal } from "@power-ui/core";
import { mount } from "@power-ui/dom";
import {
  Button,
  Card,
  Stack,
  Text,
  createTheme,
} from "@power-ui/ui";

const theme = createTheme("dark");
theme.bind();

const likes = signal(0);

export function App() {
  return (
    <div class="pu-p-4">
      <Card class="pu-max-w-md pu-mx-auto" variant="glass">
        <Stack gap={4}>
          <div>
            <Text as="h2" size="xl">Integrated styling</Text>
            <Text muted size="sm" class="pu-mt-2">
              Utilities and primitives share one token file.
            </Text>
          </div>
          <Stack direction="row" gap={2} wrap>
            <Button onClick={() => likes.update((n) => n + 1)}>
              {() => \`Likes: \${likes()}\`}
            </Button>
            <Button variant="ghost" onClick={() => theme.toggle()}>
              Toggle theme
            </Button>
          </Stack>
          <Card variant="soft" padded>
            <Text size="sm" muted>
              Prefer Button / Stack when you can. Utilities are for one-off layout.
            </Text>
          </Card>
        </Stack>
      </Card>
    </div>
  );
}

mount(document.getElementById("root")!, () => <App />);
`,
  },
  {
    id: "overlays",
    title: "Dialog, Tabs & Progress",
    blurb: "Modern overlay + chrome primitives",
    tip: "Dialog is controlled with open + onClose. Tabs use a pill track. Progress reads a 0–100 signal.",
    code: `import { signal } from "@power-ui/core";
import { mount } from "@power-ui/dom";
import {
  Avatar,
  Button,
  Card,
  Dialog,
  Progress,
  Skeleton,
  Stack,
  Tabs,
  Text,
} from "@power-ui/ui";

const open = signal(false);
const pct = signal(36);

export function App() {
  return (
    <Card variant="glass">
      <Stack gap={4}>
        <Stack direction="row" gap={3} align="center">
          <Avatar name="Power UI" />
          <div>
            <Text weight="semibold">Overlays</Text>
            <Text muted size="sm">Deep blue/green · layered glass</Text>
          </div>
        </Stack>
        <Tabs
          defaultValue="a"
          items={[
            {
              id: "a",
              label: "Live",
              content: (
                <Stack gap={3}>
                  <Progress value={pct} label="Sync" />
                  <Button
                    size="sm"
                    variant="soft"
                    onClick={() => pct.set(Math.min(100, pct() + 16))}
                  >
                    Nudge progress
                  </Button>
                </Stack>
              ),
            },
            {
              id: "b",
              label: "Loading",
              content: <Skeleton lines={3} />,
            },
          ]}
        />
        <Button onClick={() => open.set(true)}>Open dialog</Button>
        <Dialog
          open={open}
          onClose={() => open.set(false)}
          title="Confirm"
          description="Escape or backdrop closes this."
        >
          <Stack gap={3}>
            <Text size="sm">Looks like a modern product modal.</Text>
            <Button onClick={() => open.set(false)}>Done</Button>
          </Stack>
        </Dialog>
      </Stack>
    </Card>
  );
}

mount(document.getElementById("root")!, () => <App />);
`,
  },
  {
    id: "challenge",
    title: "Challenge: double counter",
    blurb: "Practice — make total = a + b",
    tip: "Create two signals and one computed. Show all three with Button + Text.",
    code: `import { signal, computed } from "@power-ui/core";
import { mount } from "@power-ui/dom";
import { Button, Card, Stack, Text } from "@power-ui/ui";

// TODO: make total track a + b reactively
const a = signal(1);
const b = signal(2);
const total = computed(() => a() + b()); // keep or rewrite

export function App() {
  return (
    <Card>
      <Stack gap={4}>
        <Text as="h2" size="xl">Double counter</Text>
        <Text muted>
          A: {() => a()} · B: {() => b()}
        </Text>
        <Text weight="semibold" size="lg">
          Total: {() => total()}
        </Text>
        <Stack direction="row" gap={2}>
          <Button onClick={() => a.update((n) => n + 1)}>+A</Button>
          <Button variant="soft" onClick={() => b.update((n) => n + 1)}>
            +B
          </Button>
        </Stack>
      </Stack>
    </Card>
  );
}

mount(document.getElementById("root")!, () => <App />);
`,
  },
];

export function recipeById(id: string): Recipe | undefined {
  return recipes.find((r) => r.id === id);
}
