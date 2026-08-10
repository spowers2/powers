export interface Recipe {
  id: string;
  title: string;
  /** Short line under the title in the sidebar */
  blurb: string;
  /** One-line goal for the teaching panel header */
  goal: string;
  /** What this experiment teaches (plain language) */
  learn: string[];
  /** How the code works — short bullets */
  how: string[];
  /** Concrete things to try in the editor / preview */
  tryThis: string[];
  code: string;
}

/**
 * All recipes use the design system (@power-ui/ui).
 * Teaching copy is written for first-time learners — plain language, clear experiments.
 */
export const recipes: Recipe[] = [
  {
    id: "hello",
    title: "Hello Power UI",
    blurb: "Your first signal + button",
    goal: "Make a number go up when you click a button.",
    learn: [
      "A signal is a value that can change over time.",
      "Read it by calling it: count()",
      "Update it with count.set(…) or count.update(…)",
      "In JSX, {() => count()} stays live; {count()} is a one-time snapshot",
    ],
    how: [
      "signal(0) creates the counter",
      "Button onClick calls count.update(n => n + 1)",
      "Text re-reads count() whenever it changes — only that text updates",
    ],
    tryThis: [
      "Click “Click me” in the preview — the number should increase",
      "Change signal(0) to signal(10) and press Run (or wait for auto-run)",
      "Add a second Button that does count.update(n => n - 1)",
    ],
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
    blurb: "Auto-updating math from inputs",
    goal: "Show a total that always equals price × qty.",
    learn: [
      "computed() derives a value from other signals",
      "It re-runs only when those signals change — no dependency arrays",
      "Field + Input are design-system controls (not bare HTML)",
    ],
    how: [
      "price and qty are signals (editable state)",
      "total = computed(() => price() * qty())",
      "When either input changes, total() updates automatically",
    ],
    tryThis: [
      "Type a new price or qty — Total should update immediately",
      "Click “+ Qty” / “+ Price” and watch total",
      "Change the formula to price() * qty() + 5 and re-run",
    ],
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
    blurb: "Move a ball with springs",
    goal: "Slide a ball right and back using animate() on a signal.",
    learn: [
      "animate(signal, target, options) tweens a number over time",
      "spring() gives a natural bounce; { duration } is a timed ease",
      "Bind transform to the signal once — only that style re-runs",
    ],
    how: [
      "x is a signal (horizontal offset in px)",
      "style={() => ({ …, transform: translateX(x()px) })} is reactive",
      "“Spring →” animates x to 140; “Back” animates to 0",
    ],
    tryThis: [
      "Click “Spring →” — the green/blue ball should slide right",
      "Click “Back” — it returns",
      "Change 140 to 220 and try Spring again",
      "Swap spring() for { duration: 600, ease: \"easeOut\" }",
    ],
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
          "linear-gradient(145deg, var(--pu-brand-500), var(--pu-sage-500))",
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
    blurb: "Add & remove rows efficiently",
    goal: "Render a list that can grow and shrink without rebuilding everything.",
    learn: [
      "For walks a signal array and builds a row for each item",
      "key={(t) => t.id} reuses the same DOM row when the list reorders",
      "item() is a live accessor for that row’s data",
    ],
    how: [
      "todos is a signal of { id, title } objects",
      "Add pushes a new object; Remove filters by id",
      "Badge shows todos().length reactively",
    ],
    tryThis: [
      "Click “Add todo” a few times",
      "Remove a middle item — others should stay put",
      "Change the default titles in the signal array",
    ],
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
    blurb: "Buttons, badges, switch — themed",
    goal: "Build UI with Power UI components instead of raw HTML.",
    learn: [
      "Button / Card / Stack / Text / Switch are design-system primitives",
      "They read CSS variables from tokens.css (brand, space, radius)",
      "Variants (soft, ghost) and sizes stay consistent across the app",
    ],
    how: [
      "enabled is a signal wired to Switch",
      "Primary button toggles the same signal",
      "Badge is a small status chip using success tone (green)",
    ],
    tryThis: [
      "Toggle the switch and the Primary button — label should stay in sync",
      "Change Button variant to \"danger\" on one button",
      "Wrap another Text with muted size=\"sm\"",
    ],
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
    blurb: "Status messages + spinner",
    goal: "Show loading, then a success message after a fake save.",
    learn: [
      "Alert shows inline status (info / success / warning / danger)",
      "Spinner is for in-progress work (a11y + reduced motion)",
      "Show mounts children only when a condition is true",
    ],
    how: [
      "busy and saved are signals",
      "Fake save sets busy, then after 1.2s clears busy and sets saved",
      "Show when={() => busy()} displays the Spinner",
    ],
    tryThis: [
      "Click “Fake save” — spinner, then green success Alert",
      "Change the timeout from 1200 to 400",
      "Add Alert tone=\"warning\" that always shows above the divider",
    ],
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
    blurb: "Theme toggle + utility classes",
    goal: "Flip light/dark and see one token system restyle the UI.",
    learn: [
      "createTheme(\"dark\").bind() sets data-pu-theme on <html>",
      "Primitives and utilities share the same --pu-* CSS variables",
      "pu-p-4, pu-max-w-md are optional layout helpers — not a second framework",
    ],
    how: [
      "theme.toggle() switches light ↔ dark",
      "likes is a simple signal for the counter button",
      "Card variant glass uses translucent surface tokens",
    ],
    tryThis: [
      "Click “Toggle theme” — surfaces and text should invert",
      "Click Likes a few times",
      "Change createTheme(\"dark\") to createTheme(\"light\")",
    ],
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
    blurb: "Modals, tabs, progress bar",
    goal: "Open a dialog, switch tabs, and move a progress bar.",
    learn: [
      "Dialog is controlled: open signal + onClose",
      "Tabs take items[{ id, label, content }] and a defaultValue",
      "Progress value is 0–100 (signal-friendly)",
    ],
    how: [
      "open signal drives the modal",
      "pct signal drives Progress; “Nudge” adds 16%",
      "Tabs switch between Live (progress) and Loading (skeleton)",
    ],
    tryThis: [
      "Open the dialog, then close with ×, backdrop, or Escape",
      "Switch to Loading tab — skeleton shimmer",
      "Nudge progress until 100%",
    ],
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
            <Text muted size="sm">Ink blue + lime green · layered glass</Text>
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
    blurb: "Practice — total = a + b",
    goal: "Prove you understand signals + computed by owning two counters.",
    learn: [
      "You already know signal, computed, Button, and live text",
      "This recipe is a practice pad — break it and fix it",
    ],
    how: [
      "a and b are independent signals",
      "total = computed(() => a() + b())",
      "Each button updates only one signal; total follows both",
    ],
    tryThis: [
      "Click +A and +B — total should match a + b",
      "Add a Reset button that sets a and b back to 1 and 2",
      "Hard mode: show product (a * b) with a second computed",
    ],
    code: `import { signal, computed } from "@power-ui/core";
import { mount } from "@power-ui/dom";
import { Button, Card, Stack, Text } from "@power-ui/ui";

// Practice: total should always equal a + b
const a = signal(1);
const b = signal(2);
const total = computed(() => a() + b());

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
