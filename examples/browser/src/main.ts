/**
 * Phase 2 browser demo — core + dom + animate, no compiler.
 */
import { signal, computed } from "@power-ui/core";
import { animate, spring } from "@power-ui/animate";
import { mount, h, bindText, bindStyle, bindClass, show, list, on } from "@power-ui/dom";

type Todo = { id: number; title: string; done: boolean };

const app = document.getElementById("app");
if (!app) throw new Error("#app missing");

mount(app, () => {
  // --- Counter + motion ---
  const count = signal(0);
  const x = signal(0);

  const counterPanel = h("section", { class: "panel" }, h("h2", { text: "Counter + animate" }));
  const valueEl = h("div", { class: "counter-value" });
  bindText(valueEl, () => count());

  const ball = h("div", { class: "ball" });
  bindStyle(ball, () => ({
    transform: `translateX(${x()}px)`,
  }));

  const bump = (delta: number) => {
    count.update((n) => n + delta);
    animate(x, delta > 0 ? 120 : 0, spring({ stiffness: 220, damping: 18 }));
  };

  const row = h(
    "div",
    { class: "row" },
    h("button", {
      type: "button",
      text: "−1",
      class: "secondary",
      onClick: () => bump(-1),
    }),
    h("button", {
      type: "button",
      text: "+1",
      onClick: () => bump(1),
    }),
    h("button", {
      type: "button",
      text: "Reset",
      class: "secondary",
      onClick: () => {
        count.set(0);
        animate(x, 0, { duration: 250, ease: "easeOut" });
      },
    }),
  );

  counterPanel.append(valueEl, ball, row);

  // --- Todos (store + list + show) ---
  let nextId = 1;
  const todos = signal<Todo[]>([
    { id: nextId++, title: "Learn signal → effect", done: true },
    { id: nextId++, title: "Try mount + h()", done: false },
  ]);
  const draft = signal("");
  const remaining = computed(() => todos().filter((t) => !t.done).length);

  const todoPanel = h("section", { class: "panel" }, h("h2", { text: "Todos (list + show)" }));

  const form = h("div", { class: "row" });
  const input = h("input", {
    type: "text",
    placeholder: "Add a todo…",
  }) as HTMLInputElement;
  // keep input controlled-ish
  on(input, "input", () => draft.set(input.value));

  const addBtn = h("button", {
    type: "button",
    text: "Add",
    onClick: () => {
      const title = draft().trim();
      if (!title) return;
      todos.update((list) => [...list, { id: nextId++, title, done: false }]);
      draft.set("");
      input.value = "";
    },
  });
  form.append(input, addBtn);

  const meta = h("p", { class: "empty" });
  bindText(meta, () => `${remaining()} remaining`);

  const ul = h("ul", { class: "todos" });
  list(
    ul,
    () => todos(),
    (item) => {
      const li = h("li");
      bindClass(li, () => ({ done: item().done }));

      const label = h("span");
      bindText(label, () => item().title);

      const toggle = h("button", {
        type: "button",
        class: "secondary",
        text: () => (item().done ? "Undo" : "Done"),
        onClick: () => {
          const id = item().id;
          todos.update((all) =>
            all.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
          );
        },
      });

      const del = h("button", {
        type: "button",
        class: "danger",
        text: "✕",
        onClick: () => {
          const id = item().id;
          todos.update((all) => all.filter((t) => t.id !== id));
        },
      });

      li.append(label, toggle, del);
      return li;
    },
    { key: (t) => t.id },
  );

  const empty = h("p", { class: "empty", text: "No todos — add one above." });
  // show empty only when list is empty — sibling of ul
  const emptyHost = h("div");
  show(
    emptyHost,
    () => todos().length === 0,
    () => empty,
  );

  todoPanel.append(form, meta, ul, emptyHost);

  // --- Header ---
  const header = h(
    "header",
    null,
    h("h1", { text: "Power UI" }),
    h("p", {
      class: "sub",
      text: "Phase 2 demo — core · dom · animate (no compiler yet)",
    }),
  );

  const footer = h("p", {
    class: "footer",
    text: "Same mental model: signal → bind to DOM → animate values. GSAP adapter later.",
  });

  return h("div", null, header, counterPanel, todoPanel, footer);
});
