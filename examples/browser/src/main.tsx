/**
 * Phase 2.x browser demo — core + dom (JSX) + animate
 */
import { signal, computed } from "@power-ui/core";
import { animate, spring } from "@power-ui/animate";
import { mount, component, Show, For, bindStyle } from "@power-ui/dom";

type Todo = { id: number; title: string; done: boolean };

const CounterPanel = component(() => {
  const count = signal(0);
  const x = signal(0);

  const bump = (delta: number) => {
    count.update((n) => n + delta);
    animate(x, delta > 0 ? 120 : 0, spring({ stiffness: 220, damping: 18 }));
  };

  const ball = <div class="ball" /> as HTMLElement;
  bindStyle(ball, () => ({ transform: `translateX(${x()}px)` }));

  return (
    <section class="panel">
      <h2>Counter + animate</h2>
      <div class="counter-value">{() => count()}</div>
      {ball}
      <div class="row">
        <button type="button" class="secondary" onClick={() => bump(-1)}>
          −1
        </button>
        <button type="button" onClick={() => bump(1)}>
          +1
        </button>
        <button
          type="button"
          class="secondary"
          onClick={() => {
            count.set(0);
            animate(x, 0, { duration: 250, ease: "easeOut" });
          }}
        >
          Reset
        </button>
      </div>
    </section>
  );
});

const TodosPanel = component(() => {
  let nextId = 1;
  const todos = signal<Todo[]>([
    { id: nextId++, title: "Learn signal → effect", done: true },
    { id: nextId++, title: "Try JSX + component()", done: false },
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
    <section class="panel">
      <h2>Todos (For + Show)</h2>
      <div class="row">
        <input
          type="text"
          placeholder="Add a todo…"
          ref={(el) => {
            inputEl = el as HTMLInputElement;
          }}
          onInput={(e: Event) => {
            draft.set((e.target as HTMLInputElement).value);
          }}
          onKeyDown={(e: KeyboardEvent) => {
            if (e.key === "Enter") add();
          }}
        />
        <button type="button" onClick={add}>
          Add
        </button>
      </div>
      <p class="empty">{() => `${remaining()} remaining`}</p>
      <ul class="todos">
        <For each={() => todos()} key={(t) => t.id}>
          {(item) => (
            <li class={() => (item().done ? "done" : "")}>
              <span>{() => item().title}</span>
              <button
                type="button"
                class="secondary"
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
              </button>
              <button
                type="button"
                class="danger"
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
      <Show when={() => todos().length === 0}>
        {() => <p class="empty">No todos — add one above.</p>}
      </Show>
    </section>
  );
});

const App = component(() => (
  <div>
    <header>
      <h1>Power UI</h1>
      <p class="sub">Phase 2.x demo — core · JSX · animate</p>
    </header>
    <CounterPanel />
    <TodosPanel />
    <p class="footer">
      signal → JSX bind → animate values. GSAP adapter still parked for later.
    </p>
  </div>
));

const app = document.getElementById("app");
if (!app) throw new Error("#app missing");
mount(app, () => <App />);
