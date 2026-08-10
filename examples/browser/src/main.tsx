/**
 * Power UI browser demo — router · design system · reactive props · animate
 */
import { signal, computed } from "@power-ui/core";
import { animate, spring } from "@power-ui/animate";
import { mount, Show, For, bindStyle } from "@power-ui/dom";
import { createRouter, Link } from "@power-ui/router";
import {
  Button,
  Input,
  Stack,
  Text,
  Card,
  createTheme,
} from "@power-ui/ui";
import "@power-ui/ui/theme.css";
import "./app.css";

type Todo = { id: number; title: string; done: boolean };

const theme = createTheme(
  typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light",
);
theme.bind();

/* ---------- Pages ---------- */

function HomePage() {
  return (
    <Stack gap={4}>
      <Text as="h2" size="xl">
        Build UIs that stay small to learn
      </Text>
      <Text muted>
        Power UI: signals → JSX → router → design tokens. Edit{" "}
        <code>packages/ui/src/styles/tokens.css</code> to retheme everything.
      </Text>
      <Stack direction="row" gap={2} wrap>
        <Link router={router} to="/playground" class="pu-btn pu-btn--solid pu-btn--md">
          Open playground
        </Link>
        <Link router={router} to="/todos" class="pu-btn pu-btn--ghost pu-btn--md">
          Todos
        </Link>
      </Stack>
    </Stack>
  );
}

function PlaygroundPage() {
  const count = signal(0);
  const x = signal(0);
  const name = signal("Ada");

  const bump = (delta: number) => {
    count.update((n) => n + delta);
    animate(x, delta > 0 ? 100 : 0, spring({ stiffness: 220, damping: 18 }));
  };

  const ball = <div class="demo-ball" /> as HTMLElement;
  bindStyle(ball, () => ({ transform: `translateX(${x()}px)` }));

  return (
    <Stack gap={5}>
      <Text as="h2" size="xl">
        Playground
      </Text>

      <Card>
        <Stack gap={3}>
          <Text as="h3" size="sm" muted weight="semibold">
            Counter + animate
          </Text>
          <Text size="2xl">{() => String(count())}</Text>
          {ball}
          <Stack direction="row" gap={2} wrap>
            <Button variant="soft" onClick={() => bump(-1)}>
              −1
            </Button>
            <Button onClick={() => bump(1)}>+1</Button>
            <Button
              variant="ghost"
              onClick={() => {
                count.set(0);
                animate(x, 0, { duration: 250, ease: "easeOut" });
              }}
            >
              Reset
            </Button>
          </Stack>
        </Stack>
      </Card>

      <Card>
        <Stack gap={3}>
          <Text as="h3" size="sm" muted weight="semibold">
            Reactive props
          </Text>
          <Text>{() => `Hello, ${name()}`}</Text>
          <Stack direction="row" gap={2} wrap>
            <Button variant="ghost" onClick={() => name.set("Ada")}>
              Ada
            </Button>
            <Button variant="ghost" onClick={() => name.set("Grace")}>
              Grace
            </Button>
            <Button variant="soft" onClick={() => name.set("Katherine")}>
              Katherine
            </Button>
          </Stack>
        </Stack>
      </Card>

      <Card>
        <Stack gap={3}>
          <Text as="h3" size="sm" muted weight="semibold">
            Theme
          </Text>
          <Text muted>
            Mode: {() => theme.mode()}
          </Text>
          <Button variant="soft" onClick={() => theme.toggle()}>
            Toggle light / dark
          </Button>
        </Stack>
      </Card>
    </Stack>
  );
}

function TodosPage() {
  let nextId = 1;
  const todos = signal<Todo[]>([
    { id: nextId++, title: "Learn signals", done: true },
    { id: nextId++, title: "Try the design system", done: false },
  ]);
  const draft = signal("");
  const remaining = computed(() => todos().filter((t) => !t.done).length);
  let inputEl: HTMLInputElement | undefined;

  const add = () => {
    const title = draft().trim();
    if (!title) return;
    todos.update((list) => [...list, { id: nextId++, title, done: false }]);
    draft.set("");
    if (inputEl) inputEl.value = "";
  };

  return (
    <Stack gap={4}>
      <Text as="h2" size="xl">
        Todos
      </Text>
      <Stack direction="row" gap={2} align="center">
        <Input
          placeholder="Add a todo…"
          ref={(el) => {
            inputEl = el;
          }}
          onInput={(e) => draft.set((e.target as HTMLInputElement).value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") add();
          }}
        />
        <Button onClick={add}>Add</Button>
      </Stack>
      <Text muted size="sm">
        {() => `${remaining()} remaining`}
      </Text>
      <ul class="todo-list">
        <For each={() => todos()} key={(t) => t.id}>
          {(item) => (
            <li class={() => (item().done ? "done" : "")}>
              <span>{() => item().title}</span>
              <Stack direction="row" gap={2}>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    const id = item().id;
                    todos.update((all) =>
                      all.map((t) =>
                        t.id === id ? { ...t, done: !t.done } : t,
                      ),
                    );
                  }}
                >
                  {() => (item().done ? "Undo" : "Done")}
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => {
                    const id = item().id;
                    todos.update((all) => all.filter((t) => t.id !== id));
                  }}
                >
                  Delete
                </Button>
              </Stack>
            </li>
          )}
        </For>
      </ul>
      <Show when={() => todos().length === 0}>
        {() => (
          <Text muted>No todos — add one above.</Text>
        )}
      </Show>
    </Stack>
  );
}

/* ---------- Shell + router ---------- */

const router = createRouter({
  routes: [
    { path: "/", component: () => HomePage() },
    { path: "/playground", component: () => PlaygroundPage() },
    { path: "/todos", component: () => TodosPage() },
  ],
  notFound: () => (
    <Stack gap={3}>
      <Text as="h2" size="xl">
        404
      </Text>
      <Text muted>That page does not exist.</Text>
      <Link router={router} to="/">
        Go home
      </Link>
    </Stack>
  ),
});

function App() {
  return (
    <div class="app-shell">
      <header class="app-header">
        <Stack direction="row" justify="between" align="center" gap={4}>
          <Text as="h1" size="lg" weight="bold">
            Power UI
          </Text>
          <nav class="app-nav">
            <Link router={router} to="/" exact activeClass="active">
              Home
            </Link>
            <Link router={router} to="/playground" activeClass="active">
              Playground
            </Link>
            <Link router={router} to="/todos" activeClass="active">
              Todos
            </Link>
          </nav>
          <Button size="sm" variant="ghost" onClick={() => theme.toggle()}>
            {() => (theme.mode() === "dark" ? "Light" : "Dark")}
          </Button>
        </Stack>
      </header>
      <main class="app-main">{router.outlet()}</main>
      <footer class="app-footer">
        <Text muted size="sm">
          Plan: core → animate → dom/jsx → props → router → ssr foundation →
          design system. GSAP adapter still parked.
        </Text>
      </footer>
    </div>
  );
}

const root = document.getElementById("app");
if (!root) throw new Error("#app missing");
mount(root, () => App());
