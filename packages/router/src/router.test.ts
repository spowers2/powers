import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { flush, signal, effect } from "@power-ui/core";
import { Window } from "happy-dom";
import { matchPath, normalizePath } from "./match.js";
import { createRouter, buildPath } from "./router.js";
import { createMemoryHistory } from "./history.js";

function installDom() {
  const window = new Window({ url: "https://localhost/" });
  const g = globalThis as unknown as Record<string, unknown>;
  g.window = window;
  g.document = window.document;
  g.Node = window.Node;
  g.HTMLElement = window.HTMLElement;
  g.Text = window.Text;
  g.Element = window.Element;
  return window.document as unknown as Document;
}

async function tick() {
  await Promise.resolve();
  await Promise.resolve();
  flush();
}

describe("matchPath", () => {
  it("matches static paths", () => {
    assert.deepEqual(matchPath("/about", "/about"), { params: {} });
    assert.equal(matchPath("/about", "/other"), null);
  });

  it("matches params", () => {
    const m = matchPath("/users/:id", "/users/42");
    assert.ok(m);
    assert.equal(m!.params.id, "42");
  });

  it("normalizes trailing slashes", () => {
    assert.equal(normalizePath("/about/"), "/about");
    assert.ok(matchPath("/about", "/about/"));
  });

  it("matches splats", () => {
    const m = matchPath("/files/*path", "/files/a/b");
    assert.ok(m);
    assert.equal(m!.params.path, "a/b");
  });
});

describe("createRouter", () => {
  let document: Document;

  beforeEach(() => {
    document = installDom();
  });

  it("renders matching route and navigates", async () => {
    const history = createMemoryHistory("/");
    const router = createRouter({
      history,
      routes: [
        {
          path: "/",
          component: () => {
            const el = document.createElement("div");
            el.textContent = "home";
            return el;
          },
        },
        {
          path: "/about",
          component: () => {
            const el = document.createElement("div");
            el.textContent = "about";
            return el;
          },
        },
        {
          path: "/users/:id",
          component: ({ params }) => {
            const el = document.createElement("div");
            el.textContent = `user-${params.id}`;
            return el;
          },
        },
      ],
    });

    const root = document.createElement("div");
    document.body.appendChild(root);
    root.appendChild(router.outlet());
    await tick();
    assert.equal(root.textContent, "home");

    router.navigate("/about");
    await tick();
    assert.equal(root.textContent, "about");

    router.navigate("/users/7");
    await tick();
    assert.equal(root.textContent, "user-7");
    assert.equal(router.params().id, "7");

    router.dispose();
  });

  it("buildPath fills params", () => {
    assert.equal(buildPath("/users/:id", { id: "3" }), "/users/3");
  });

  it("notFound for unknown routes", async () => {
    const history = createMemoryHistory("/nope");
    const router = createRouter({
      history,
      routes: [
        {
          path: "/",
          component: () => {
            const el = document.createElement("div");
            el.textContent = "home";
            return el;
          },
        },
      ],
      notFound: () => {
        const el = document.createElement("div");
        el.textContent = "404";
        return el;
      },
    });
    const root = document.createElement("div");
    root.appendChild(router.outlet());
    await tick();
    assert.equal(root.textContent, "404");
    router.dispose();
  });

  it("outlet does not remount when form signals update (createRoot isolation)", async () => {
    // designlab206 regression: typing in Input remounted the whole page because
    // the outlet effect tracked signals read during route setup.
    const email = signal("");
    let mounts = 0;
    const history = createMemoryHistory("/");
    const router = createRouter({
      history,
      routes: [
        {
          path: "/",
          component: () => {
            mounts++;
            const wrap = document.createElement("div");
            wrap.setAttribute("data-mount", String(mounts));
            // Simulate controlled Input reading signal during setup
            const seed = email();
            const input = document.createElement("input");
            input.value = seed;
            // Child effect (like bindProp) tracks email — must not remount outlet
            effect(() => {
              const next = email();
              if (document.activeElement !== input && input.value !== next) {
                input.value = next;
              }
            });
            wrap.appendChild(input);
            return wrap;
          },
        },
      ],
    });

    const root = document.createElement("div");
    document.body.appendChild(root);
    root.appendChild(router.outlet());
    await tick();
    assert.equal(mounts, 1);
    const first = root.querySelector("[data-mount]") as HTMLElement;
    assert.equal(first.getAttribute("data-mount"), "1");

    email.set("a@b.co");
    await tick();
    assert.equal(mounts, 1, "outlet must not remount on form signal write");
    assert.equal(
      root.querySelector("[data-mount]")?.getAttribute("data-mount"),
      "1",
    );
    assert.equal(
      (root.querySelector("input") as HTMLInputElement).value,
      "a@b.co",
    );

    router.navigate("/missing");
    await tick();
    // path change may remount notFound; navigate back
    router.navigate("/");
    await tick();
    assert.equal(mounts, 2, "path change remounts the route");

    router.dispose();
  });

  it("outlet remounts only when path changes", async () => {
    let mounts = 0;
    const history = createMemoryHistory("/");
    const router = createRouter({
      history,
      routes: [
        {
          path: "/",
          component: () => {
            mounts++;
            const el = document.createElement("div");
            el.textContent = "home";
            return el;
          },
        },
        {
          path: "/about",
          component: () => {
            mounts++;
            const el = document.createElement("div");
            el.textContent = "about";
            return el;
          },
        },
      ],
    });
    const root = document.createElement("div");
    root.appendChild(router.outlet());
    await tick();
    assert.equal(mounts, 1);
    router.navigate("/");
    await tick();
    assert.equal(mounts, 1, "same path does not remount");
    router.navigate("/about");
    await tick();
    assert.equal(mounts, 2);
    router.navigate("/about");
    await tick();
    assert.equal(mounts, 2);
    router.dispose();
  });

  it("outlet remounts when query string changes", async () => {
    let mounts = 0;
    let lastSearch = "";
    const history = createMemoryHistory("/invoices");
    const router = createRouter({
      history,
      routes: [
        {
          path: "/invoices",
          component: ({ location }) => {
            mounts++;
            lastSearch = location.search;
            const el = document.createElement("div");
            el.textContent = location.search || "none";
            return el;
          },
        },
      ],
    });
    const root = document.createElement("div");
    root.appendChild(router.outlet());
    await tick();
    assert.equal(mounts, 1);
    router.navigate("/invoices?status=overdue");
    await tick();
    assert.equal(mounts, 2, "query change remounts for deep links");
    assert.equal(lastSearch, "?status=overdue");
    assert.equal(router.search(), "?status=overdue");
    router.navigate("/invoices?status=overdue");
    await tick();
    assert.equal(mounts, 2, "identical query does not remount");
    router.dispose();
  });
});
