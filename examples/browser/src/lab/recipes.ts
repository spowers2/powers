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
 * First three recipes for new learners (Lab “Start here”).
 * hello · form · tokens (theme) — under 10 minutes total.
 */
export const START_HERE_IDS = ["hello", "form", "tokens"] as const;

/**
 * All recipes use the design system (@lab206/ui).
 * Teaching copy is written for first-time learners — plain language, clear experiments.
 */
export const recipes: Recipe[] = [
  {
    id: "hello",
    title: "Hello Powers",
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
    code: `import { signal } from "@lab206/core";
import { mount } from "@lab206/dom";
import { Button, Card, Stack, Text } from "@lab206/ui";

const count = signal(0);

export function App() {
  return (
    <Card>
      <Stack gap={4}>
        <Text as="h2" size="xl">Hello Powers</Text>
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
    code: `import { signal, computed } from "@lab206/core";
import { mount } from "@lab206/dom";
import { Button, Card, Field, Input, Stack, Text } from "@lab206/ui";

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
            onInput={(e) => {
              const t = e.currentTarget ?? e.target;
              const v = t && "value" in (t as object) ? Number((t as HTMLInputElement).value) : 0;
              price.set(Number.isFinite(v) ? v : 0);
            }}
          />
        </Field>
        <Field label="Qty">
          <Input
            type="number"
            value={() => String(qty())}
            onInput={(e) => {
              const t = e.currentTarget ?? e.target;
              const v = t && "value" in (t as object) ? Number((t as HTMLInputElement).value) : 0;
              qty.set(Number.isFinite(v) ? v : 0);
            }}
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
    code: `import { signal } from "@lab206/core";
import { animate, spring } from "@lab206/animate";
import { mount } from "@lab206/dom";
import { Button, Card, Stack, Text } from "@lab206/ui";

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
    id: "gsap",
    title: "GSAP adapter",
    blurb: "Optional pro eases on signals",
    goal: "Drive the same ball with gsapAnimate — still a Powers signal.",
    learn: [
      "Default motion is animate() — no GSAP required",
      "Optional peer: import from @lab206/animate/gsap (Lab injects it)",
      "Duration is in milliseconds (same unit as animate), converted for GSAP",
      "One active animation per signal — GSAP and native animate interrupt each other",
    ],
    how: [
      "x is still a number signal bound to transform",
      "gsapAnimate(x, 160, { ease: \"power3.out\" }) uses GSAP under the hood",
      "cancel(x) stops whichever engine last touched the signal",
    ],
    tryThis: [
      "Click “GSAP →” — smoother power ease than default CSS-ish tween",
      "Try ease: \"elastic.out(1, 0.4)\" for a bouncy overshoot",
      "Hit Back mid-flight — cancel + new tween should feel interruptible",
      "Compare with the Spring motion recipe (no GSAP)",
    ],
    code: `import { signal } from "@lab206/core";
import { cancel } from "@lab206/animate";
// Optional peer path (Lab also injects gsapAnimate):
import { gsapAnimate } from "@lab206/animate/gsap";
import { mount } from "@lab206/dom";
import { Button, Card, Stack, Text, Badge } from "@lab206/ui";

const x = signal(0);
const label = signal("idle");

export function App() {
  const go = () => {
    label.set("gsap…");
    gsapAnimate(x, 160, {
      duration: 700,
      ease: "power3.out",
      onComplete: () => label.set("done"),
    });
  };

  const back = () => {
    cancel(x);
    label.set("back…");
    gsapAnimate(x, 0, {
      duration: 350,
      ease: "power2.inOut",
      onComplete: () => label.set("idle"),
    });
  };

  const elastic = () => {
    label.set("elastic…");
    gsapAnimate(x, 140, {
      duration: 900,
      ease: "elastic.out(1, 0.45)",
      onComplete: () => label.set("done"),
    });
  };

  return (
    <Card>
      <Stack gap={4}>
        <Stack direction="row" gap={2} align="center" wrap>
          <Text as="h2" size="xl">GSAP on a signal</Text>
          <Badge tone="accent">{() => label()}</Badge>
        </Stack>
        <Text muted size="sm">
          Install peer <code>gsap</code> in real apps. Default{" "}
          <code>animate()</code> stays zero-dependency.
        </Text>
        <div
          style={() => ({
            width: 48,
            height: 48,
            borderRadius: 999,
            background:
              "linear-gradient(145deg, var(--pu-sage-500), var(--pu-brand-600))",
            boxShadow: "var(--pu-shadow-md)",
            transform: \`translateX(\${x()}px)\`,
          })}
        />
        <Text size="sm" muted>
          x = {() => Math.round(x())}px
        </Text>
        <Stack direction="row" gap={2} wrap>
          <Button onClick={go}>GSAP →</Button>
          <Button variant="soft" onClick={elastic}>
            Elastic
          </Button>
          <Button variant="ghost" onClick={back}>
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
    code: `import { signal } from "@lab206/core";
import { mount, For } from "@lab206/dom";
import { Badge, Button, Card, Stack, Text } from "@lab206/ui";

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
    goal: "Build UI with Powers components instead of raw HTML.",
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
    code: `import { signal } from "@lab206/core";
import { mount } from "@lab206/dom";
import {
  Badge,
  Button,
  Card,
  Stack,
  Switch,
  Text,
} from "@lab206/ui";

const enabled = signal(true);

export function App() {
  return (
    <Card variant="elevated">
      <Stack gap={4}>
        <Stack direction="row" justify="between" align="center">
          <Text as="h2" size="xl">Powers kit</Text>
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
    code: `import { signal } from "@lab206/core";
import { mount, Show } from "@lab206/dom";
import {
  Alert,
  Button,
  Card,
  Divider,
  Spinner,
  Stack,
  Text,
} from "@lab206/ui";

const busy = signal(false);
const saved = signal(false);

export function App() {
  return (
    <Card>
      <Stack gap={4}>
        <Text as="h2" size="xl">Feedback</Text>
        <Alert tone="info" title="Heads up">
          Powers ships feedback components with the runtime.
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
    code: `import { signal } from "@lab206/core";
import { mount } from "@lab206/dom";
import {
  Button,
  Card,
  Stack,
  Text,
  createTheme,
} from "@lab206/ui";

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
    code: `import { signal } from "@lab206/core";
import { mount } from "@lab206/dom";
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
} from "@lab206/ui";

const open = signal(false);
const pct = signal(36);

export function App() {
  return (
    <Card variant="glass">
      <Stack gap={4}>
        <Stack direction="row" gap={3} align="center">
          <Avatar name="Powers" />
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
    id: "async",
    title: "Async resource",
    blurb: "Loading · error · data",
    goal: "Fetch fake user data with resource() and show loading / error / result.",
    learn: [
      "resource(fetcher) loads async data into a reactive value",
      "user.loading() and user.error() drive UI without extra flags",
      "user.refetch() re-runs the fetcher — UI stays simple",
    ],
    how: [
      "resource simulates a network delay then returns a name",
      "Show branches on loading / error / ready",
      "Retry calls refetch()",
    ],
    tryThis: [
      "Click Load / Retry and watch Spinner → name",
      "Change the delay from 800 to 200",
      "Make the fetcher throw sometimes to see the error Alert",
    ],
    code: `import { resource } from "@lab206/core";
import { mount, Show } from "@lab206/dom";
import {
  Alert,
  Button,
  Card,
  Spinner,
  Stack,
  Text,
} from "@lab206/ui";

// Fake API — replace with fetch("/api/…") in a real app
const user = resource(async () => {
  await new Promise((r) => setTimeout(r, 800));
  if (Math.random() < 0.15) throw new Error("Network glitch");
  return { name: "Ada Lovelace", role: "Engineer" };
});

export function App() {
  return (
    <Card>
      <Stack gap={4}>
        <Text as="h2" size="xl">Async user</Text>
        <Text muted size="sm">
          resource() handles pending / ready / error without spaghetti.
        </Text>
        <Show when={() => user.loading()}>
          {() => (
            <Stack direction="row" gap={2} align="center">
              <Spinner label="Loading user" />
              <Text muted size="sm">Fetching…</Text>
            </Stack>
          )}
        </Show>
        <Show when={() => !!user.error() && !user.loading()}>
          {() => (
            <Alert tone="danger" title="Failed">
              {() => String(user.error())}
            </Alert>
          )}
        </Show>
        <Show when={() => !!user() && !user.loading()}>
          {() => (
            <Stack gap={1}>
              <Text weight="semibold">{() => user()!.name}</Text>
              <Text muted size="sm">{() => user()!.role}</Text>
            </Stack>
          )}
        </Show>
        <Button variant="soft" onClick={() => user.refetch()}>
          Retry / refetch
        </Button>
      </Stack>
    </Card>
  );
}

mount(document.getElementById("root")!, () => <App />);
`,
  },
  {
    id: "query",
    title: "createQuery + live API",
    blurb: "Signal key · real fetch",
    goal: "Drive a public API with createQuery — change the key, UI stays simple.",
    learn: [
      "createQuery({ queryKey, queryFn }) is resource() with a signal-friendly key",
      "queryKey: () => topic() re-runs when the signal changes — no dependency arrays",
      "loading / error / latest keep the board stable while refetching",
    ],
    how: [
      "topic is a signal; chips write topic.set(...)",
      "createQuery fetches advice from a public API for that key",
      "Show branches on loading and error; text reads data()",
    ],
    tryThis: [
      "Click different topics and watch only this card update",
      "Hit Refresh — latest stays visible while loading",
      "Swap the API URL for your own endpoint",
    ],
    code: `import { signal, createQuery } from "@lab206/core";
import { mount, Show } from "@lab206/dom";
import {
  Alert,
  Button,
  Card,
  Spinner,
  Stack,
  Text,
} from "@lab206/ui";

const topic = signal("design");

// Public demo API (no key). Replace with your backend.
const tip = createQuery({
  queryKey: () => topic(),
  queryFn: async (key) => {
    const res = await fetch(
      "https://api.adviceslip.com/advice?" + encodeURIComponent(key),
    );
    if (!res.ok) throw new Error("Request failed");
    const json = await res.json();
    return { key, advice: json.slip?.advice ?? "No advice" };
  },
});

export function App() {
  return (
    <Card>
      <Stack gap={4}>
        <Text as="h2" size="xl">Live query</Text>
        <Stack direction="row" gap={2} wrap>
          {["design", "shipping", "clients"].map((t) => (
            <Button
              size="sm"
              variant={() => (topic() === t ? "solid" : "soft")}
              onClick={() => topic.set(t)}
            >
              {t}
            </Button>
          ))}
        </Stack>
        <Show when={() => tip.loading() && !tip.latest()}>
          {() => (
            <Stack direction="row" gap={2} align="center">
              <Spinner />
              <Text muted size="sm">Fetching…</Text>
            </Stack>
          )}
        </Show>
        <Show when={() => !!tip.error() && !tip.loading()}>
          {() => (
            <Alert tone="danger" title="Failed">
              {() => String(tip.error())}
            </Alert>
          )}
        </Show>
        <Text>
          {() => tip.latest()?.advice ?? tip()?.advice ?? "—"}
        </Text>
        <Button variant="soft" onClick={() => tip.refetch()}>
          Refresh
        </Button>
      </Stack>
    </Card>
  );
}

mount(document.getElementById("root")!, () => <App />);
`,
  },
  {
    id: "form",
    title: "Form validation",
    blurb: "bind + Field errors",
    goal: "Validate with bind={signal} and only enable Save when the form is valid.",
    learn: [
      "Prefer bind={signal} — no onInput casts",
      "Field error={…} stays reactive while you type",
      "Disable submit until validation passes",
    ],
    how: [
      "name / email / agreed are signals wired with bind",
      "emailError / nameError return messages after first submit",
      "Save touches validation then writes status",
    ],
    tryThis: [
      "Type a bad email — see the red Field error after Save",
      "Fix email + check the box — Save enables",
      "Add a phone Field with bind the same way",
    ],
    code: `import { signal, computed } from "@lab206/core";
import { mount } from "@lab206/dom";
import {
  Button,
  Card,
  Checkbox,
  Field,
  Input,
  Stack,
  Text,
  required,
  emailFormat,
  firstError,
  minLength,
} from "@lab206/ui";

const email = signal("");
const name = signal("");
const agreed = signal(false);
const status = signal("");
const submitted = signal(false);

const emailError = () => {
  if (!submitted() && !email()) return "";
  return firstError(
    required(email(), "Email is required"),
    emailFormat(email()),
  );
};
const nameError = () => {
  if (!submitted() && !name()) return "";
  return firstError(
    required(name(), "Name is required"),
    minLength(name(), 2),
  );
};

const canSave = computed(
  () => !emailError() && !nameError() && agreed() && !!email() && !!name(),
);

export function App() {
  return (
    <Card>
      <Stack gap={4}>
        <Text as="h2" size="xl">Signup</Text>
        <Field label="Name" required error={nameError}>
          <Input bind={name} placeholder="Ada" />
        </Field>
        <Field
          label="Email"
          required
          error={emailError}
          hint="We'll never share it."
        >
          <Input bind={email} type="email" placeholder="you@company.com" />
        </Field>
        <Checkbox label="I agree to the terms" bind={agreed} />
        <Button
          disabled={() => !canSave()}
          onClick={() => {
            submitted.set(true);
            if (!canSave()) {
              status.set("Fix the fields above");
              return;
            }
            status.set(\`Saved \${name()} · \${email()}\`);
          }}
        >
          Save
        </Button>
        <Text muted size="sm">{() => status() || " "}</Text>
      </Stack>
    </Card>
  );
}

mount(document.getElementById("root")!, () => <App />);
`,
  },
  {
    id: "create-field",
    title: "createField pattern",
    blurb: "Touched + error in one handle",
    goal: "Build a profile form with createField and Select bind.",
    learn: [
      "createField({ validate }) owns value, touch, and error()",
      "bind={field.value} + onBlur={field.touch}",
      "asSelectBind for typed status unions",
    ],
    how: [
      "name / email are createField handles",
      "role is a string signal on Select bind",
      "Submit calls touch() on each field then checks error()",
    ],
    tryThis: [
      "Blur an empty name — error appears",
      "Pick a role and save — status shows the payload",
      "Change validate on email to require a .com address",
    ],
    code: `import { signal } from "@lab206/core";
import { mount } from "@lab206/dom";
import {
  Button,
  Card,
  Field,
  Input,
  Select,
  Stack,
  Text,
  createField,
  required,
  emailFormat,
  firstError,
} from "@lab206/ui";

const name = createField({
  validate: (v) => required(v, "Name required"),
});
const email = createField({
  validate: (v) => firstError(required(v), emailFormat(v)),
});
const role = signal("dev");
const status = signal("");

export function App() {
  return (
    <Card>
      <Stack gap={4}>
        <Text as="h2" size="xl">Profile</Text>
        <Field label="Name" required error={name.error}>
          <Input bind={name.value} onBlur={name.touch} placeholder="Ada" />
        </Field>
        <Field label="Email" required error={email.error}>
          <Input
            bind={email.value}
            type="email"
            onBlur={email.touch}
            placeholder="ada@example.com"
          />
        </Field>
        <Field label="Role">
          <Select
            bind={role}
            options={[
              { value: "dev", label: "Developer" },
              { value: "design", label: "Designer" },
              { value: "pm", label: "Product" },
            ]}
          />
        </Field>
        <Button
          onClick={() => {
            name.touch();
            email.touch();
            if (name.error() || email.error()) {
              status.set("Fix the fields above");
              return;
            }
            status.set(\`\${name.get()} · \${email.get()} · \${role()}\`);
          }}
        >
          Save profile
        </Button>
        <Text muted size="sm">{() => status() || " "}</Text>
      </Stack>
    </Card>
  );
}

mount(document.getElementById("root")!, () => <App />);
`,
  },
  {
    id: "settings",
    title: "Cookbook: Settings page",
    blurb: "Theme-ready profile form",
    goal: "Build a settings screen with createField, Select, and Switch.",
    learn: [
      "createField owns value + touch + error for each input",
      "bind={field.value} is the preferred control wiring",
      "Stack + Card + Field = a polished settings layout with almost no CSS",
    ],
    how: [
      "name / email are createField handles",
      "notify is a boolean signal on Switch bind",
      "Save touches fields, validates, then sets a status line",
    ],
    tryThis: [
      "Leave name empty and Save — see Field errors",
      "Toggle notifications and save a valid profile",
      "Add a timezone Select the same way as role",
    ],
    code: `import { signal } from "@lab206/core";
import { mount } from "@lab206/dom";
import {
  Button,
  Card,
  Field,
  Input,
  Select,
  Stack,
  Switch,
  Text,
  createField,
  required,
  emailFormat,
  firstError,
} from "@lab206/ui";

const name = createField({
  initial: "Sam Rivera",
  validate: (v) => required(v, "Name required"),
});
const email = createField({
  initial: "sam@designlab206.com",
  validate: (v) => firstError(required(v), emailFormat(v)),
});
const role = signal("owner");
const notify = signal(true);
const status = signal("");

export function App() {
  return (
    <Card>
      <Stack gap={4}>
        <Stack gap={1}>
          <Text as="h2" size="xl">Settings</Text>
          <Text muted size="sm">Profile + preferences — cookbook pattern</Text>
        </Stack>
        <Field label="Display name" required error={name.error}>
          <Input bind={name.value} onBlur={name.touch} />
        </Field>
        <Field label="Email" required error={email.error}>
          <Input bind={email.value} type="email" onBlur={email.touch} />
        </Field>
        <Field label="Role">
          <Select
            bind={role}
            options={[
              { value: "owner", label: "Owner" },
              { value: "admin", label: "Admin" },
              { value: "member", label: "Member" },
            ]}
          />
        </Field>
        <Switch bind={notify} label="Email product updates" />
        <Stack direction="row" gap={2}>
          <Button
            onClick={() => {
              name.touch();
              email.touch();
              if (name.error() || email.error()) {
                status.set("Fix the fields above");
                return;
              }
              status.set(
                \`Saved \${name.get()} · \${email.get()} · \${role()} · notify=\${notify()}\`,
              );
            }}
          >
            Save
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              name.reset("Sam Rivera");
              email.reset("sam@designlab206.com");
              role.set("owner");
              notify.set(true);
              status.set("");
            }}
          >
            Reset
          </Button>
        </Stack>
        <Text muted size="sm">{() => status() || " "}</Text>
      </Stack>
    </Card>
  );
}

mount(document.getElementById("root")!, () => <App />);
`,
  },
  {
    id: "admin-list",
    title: "Cookbook: Admin list",
    blurb: "Search + Table + Empty",
    goal: "Filter a table of rows and show Empty when nothing matches.",
    learn: [
      "Keep filter in a signal; derive visible rows with computed",
      "Table + Empty is the default admin list pattern",
      "bind={filter} on the search Input — no casts",
    ],
    how: [
      "rows is static seed data; filter is live state",
      "visible recomputes when filter changes",
      "Empty appears when visible().length === 0",
    ],
    tryThis: [
      "Type “north” — only Northline should remain",
      "Clear the search — full table returns",
      "Add a status column to columns + rows",
    ],
    code: `import { signal, computed } from "@lab206/core";
import { mount } from "@lab206/dom";
import {
  Button,
  Card,
  Empty,
  Field,
  Input,
  Stack,
  Table,
  Text,
} from "@lab206/ui";

const rows = [
  { id: "1", company: "Northline Health", contact: "Avery", status: "active" },
  { id: "2", company: "Field & Co.", contact: "Jordan", status: "active" },
  { id: "3", company: "Orbit Payments", contact: "Riley", status: "lead" },
];

const filter = signal("");
const visible = computed(() => {
  const q = filter().trim().toLowerCase();
  if (!q) return rows;
  return rows.filter(
    (r) =>
      r.company.toLowerCase().includes(q) ||
      r.contact.toLowerCase().includes(q) ||
      r.status.toLowerCase().includes(q),
  );
});

const columns = [
  { key: "company", header: "Company" },
  { key: "contact", header: "Contact" },
  { key: "status", header: "Status" },
];

export function App() {
  return (
    <Card>
      <Stack gap={4}>
        <Stack direction="row" gap={2} justify="between" align="center" wrap>
          <Text as="h2" size="xl">Clients</Text>
          <Button size="sm" variant="soft">Add client</Button>
        </Stack>
        <Field label="Search">
          <Input bind={filter} placeholder="Company, contact, status…" />
        </Field>
        {() => {
          const list = visible();
          if (list.length === 0) {
            return (
              <Empty
                icon="◎"
                title="No matches"
                description="Try another search."
              />
            );
          }
          return (
            <Table
              columns={columns}
              rows={list}
            />
          );
        }}
        <Text muted size="sm">
          {() => \`\${visible().length} row(s)\`}
        </Text>
      </Stack>
    </Card>
  );
}

mount(document.getElementById("root")!, () => <App />);
`,
  },
  {
    id: "menu",
    title: "Menu & Popover",
    blurb: "Actions menu + floating panel",
    goal: "Open a Menu, pick an action, and toggle a Popover.",
    learn: [
      "Popover is a controlled panel: open signal + onOpenChange",
      "Menu builds an action list on top of Popover",
      "Escape and outside-click dismiss while open",
    ],
    how: [
      "menuPick stores the last selected menu id",
      "Menu onSelect updates that signal and closes",
      "Popover wraps custom content under a trigger button",
    ],
    tryThis: [
      "Open Actions → choose Edit or Delete",
      "Open the popover, then close with Escape or outside click",
      "Add a third menu item with danger: true",
    ],
    code: `import { signal } from "@lab206/core";
import { mount } from "@lab206/dom";
import {
  Button,
  Card,
  Kbd,
  Menu,
  Popover,
  Stack,
  Text,
} from "@lab206/ui";

const pick = signal("—");
const open = signal(false);

export function App() {
  return (
    <Card>
      <Stack gap={4}>
        <Text as="h2" size="xl">Menus & popovers</Text>
        <Text muted size="sm">
          Product chrome for actions — not raw details/summary hacks.
        </Text>
        <Stack direction="row" gap={3} align="center" wrap>
          <Menu
            trigger={<Button size="sm">Actions</Button>}
            items={[
              { id: "edit", label: "Edit" },
              { id: "dup", label: "Duplicate" },
              { id: "del", label: "Delete", danger: true },
            ]}
            onSelect={(id) => pick.set(id)}
          />
          <Text size="sm" muted>
            Last pick: {() => pick()}
          </Text>
        </Stack>
        <Popover
          open={open}
          onOpenChange={(v) => open.set(v)}
          trigger={
            <Button size="sm" variant="soft">
              {() => (open() ? "Close tip" : "Open tip")}
            </Button>
          }
        >
          <Stack gap={2}>
            <Text weight="semibold" size="sm">Shortcut</Text>
            <Text size="sm" muted>
              Press <Kbd>Esc</Kbd> to dismiss this panel.
            </Text>
          </Stack>
        </Popover>
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
    code: `import { signal, computed } from "@lab206/core";
import { mount } from "@lab206/dom";
import { Button, Card, Stack, Text } from "@lab206/ui";

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
  {
    id: "motion",
    title: "Motion presets",
    blurb: "Fade + collapse transitions",
    goal: "Toggle content with named Transition presets (pu-fade / pu-collapse).",
    learn: [
      "Transition name matches a CSS preset (pu-fade, pu-collapse)",
      "show={signal} drives enter/exit without manual DOM timing",
      "MOTION_PRESETS documents the built-in language",
    ],
    how: [
      "open is a signal; Transition re-runs classes when it flips",
      "pu-fade for soft panels; pu-collapse for height",
      "Reduced motion is honored in the preset CSS",
    ],
    tryThis: [
      "Toggle Fade and Collapse",
      "Change name to \"pu-collapse\" on the fade panel",
      "Wrap a Card in Transition for a soft mount",
    ],
    code: `import { signal } from "@lab206/core";
import { mount } from "@lab206/dom";
import {
  Button,
  Card,
  Stack,
  Text,
  Transition,
  MOTION_PRESETS,
} from "@lab206/ui";

const fade = signal(true);
const collapse = signal(true);

export function App() {
  return (
    <Stack gap={4}>
      <Card>
        <Stack gap={3}>
          <Text weight="semibold">Presets</Text>
          <Text muted size="sm">
            {() => MOTION_PRESETS.map((p) => p.name).join(" · ")}
          </Text>
          <Stack direction="row" gap={2}>
            <Button size="sm" onClick={() => fade.update((v) => !v)}>
              Toggle fade
            </Button>
            <Button size="sm" variant="soft" onClick={() => collapse.update((v) => !v)}>
              Toggle collapse
            </Button>
          </Stack>
        </Stack>
      </Card>
      <Transition name="pu-fade" show={fade}>
        <Card variant="soft">
          <Text size="sm">Fade panel — soft enter/exit</Text>
        </Card>
      </Transition>
      <Transition name="pu-collapse" show={collapse} duration={360}>
        <Card>
          <Text size="sm">Collapse panel — height animate</Text>
        </Card>
      </Transition>
    </Stack>
  );
}

mount(document.getElementById("root")!, () => <App />);
`,
  },
  {
    id: "kit",
    title: "Layout kit",
    blurb: "Accordion, Stat, Table, Drawer",
    goal: "Compose product surfaces from the expanded component kit.",
    learn: [
      "Powers ships more structure primitives than Bootstrap (Stat, Timeline, Steps, Empty…)",
      "createStyleSheet makes new components a few lines of CSS + JSX",
      "Drawer / Dialog / Command trap focus and restore it on close",
    ],
    how: [
      "Stat is a KPI card; Accordion is multi/single expand",
      "Table takes columns + rows; Drawer slides from the side",
      "All use the same --pu-* tokens as Button and Card",
    ],
    tryThis: [
      "Open the drawer and press Esc — it should close and restore focus",
      "Add a third accordion item",
      "Change Stat tone to negative and tweak the delta string",
    ],
    code: `import { signal } from "@lab206/core";
import { mount } from "@lab206/dom";
import {
  Accordion,
  Button,
  Card,
  Drawer,
  Grid,
  Stack,
  Stat,
  Table,
  Text,
} from "@lab206/ui";

const open = signal(false);

export function App() {
  return (
    <Stack gap={4}>
      <Grid cols={2} gap={3}>
        <Stat label="Signups" value="842" delta="+12%" tone="positive" />
        <Stat label="Churn" value="1.4%" delta="+0.2%" tone="negative" />
      </Grid>
      <Card>
        <Stack gap={3}>
          <Text weight="semibold">FAQ</Text>
          <Accordion
            single
            defaultValue={["a"]}
            items={[
              { id: "a", title: "Signals?", content: "Read with count(), write with .set" },
              { id: "b", title: "Retheme?", content: "Edit tokens.css once." },
            ]}
          />
          <Button variant="soft" onClick={() => open.set(true)}>
            Open drawer
          </Button>
        </Stack>
      </Card>
      <Table
        dense
        columns={[
          { key: "name", header: "Name" },
          { key: "role", header: "Role" },
        ]}
        rows={[
          { name: "Ada", role: "Eng" },
          { name: "Grace", role: "Design" },
        ]}
      />
      <Drawer open={open} onClose={() => open.set(false)} title="Details">
        <Text size="sm" muted>
          Focus is trapped here while open.
        </Text>
      </Drawer>
    </Stack>
  );
}

mount(document.getElementById("root")!, () => <App />);
`,
  },
];

export function recipeById(id: string): Recipe | undefined {
  return recipes.find((r) => r.id === id);
}

/** Alias used in docs / Start here (tokens recipe is the theme toggle lesson). */
export const THEME_RECIPE_ID = "tokens";

export function startHereRecipes(): Recipe[] {
  return START_HERE_IDS.map((id) => recipeById(id)).filter(
    (r): r is Recipe => r != null,
  );
}
