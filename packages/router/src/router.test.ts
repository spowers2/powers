import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { flush } from "@power-ui/core";
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
});
