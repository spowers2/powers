import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { signal, flush, effect } from "@lab206/core";
import { installDom } from "./test-setup.js";
import {
  mount,
  component,
  createProps,
  mergeProps,
  splitProps,
} from "./index.js";
import { jsx } from "./jsx-runtime.js";

async function tick(): Promise<void> {
  await Promise.resolve();
  await Promise.resolve();
  flush();
}

describe("reactive props", () => {
  let root: HTMLElement;

  beforeEach(() => {
    const { document } = installDom();
    root = document.createElement("div");
    document.body.appendChild(root);
  });

  it("createProps unwraps signals on read", () => {
    const name = signal("Ada");
    const props = createProps({ name, age: 36 });
    assert.equal(props.name, "Ada");
    assert.equal(props.age, 36);
    name.set("Grace");
    assert.equal(props.name, "Grace");
  });

  it("createProps unwraps zero-arg accessors", () => {
    const user = signal({ name: "Ada" });
    const props = createProps({
      name: () => user().name,
    });
    assert.equal(props.name, "Ada");
    user.set({ name: "Grace" });
    assert.equal(props.name, "Grace");
  });

  it("does not call multi-arg callbacks", () => {
    const render = (n: number) => n * 2;
    const props = createProps({ render });
    assert.equal(typeof props.render, "function");
    assert.equal((props.render as (n: number) => number)(3), 6);
  });

  it("does not call event handlers on read", () => {
    let clicks = 0;
    const props = createProps({
      onClick: () => {
        clicks++;
      },
    });
    const handler = props.onClick as () => void;
    assert.equal(clicks, 0);
    handler();
    assert.equal(clicks, 1);
  });

  it("tracks prop reads in effects", async () => {
    const name = signal("Ada");
    const props = createProps({ name });
    const seen: string[] = [];
    effect(() => {
      seen.push(props.name as string);
    });
    assert.deepEqual(seen, ["Ada"]);
    name.set("Grace");
    await tick();
    assert.deepEqual(seen, ["Ada", "Grace"]);
  });

  it("component props stay live when parent passes a signal", async () => {
    const name = signal("Ada");

    const Hello = component((props: { name: string }) => {
      const el = document.createElement("p");
      effect(() => {
        el.textContent = `Hello, ${props.name}`;
      });
      return el;
    });

    mount(root, () => Hello({ name }));
    assert.equal(root.textContent, "Hello, Ada");

    name.set("Grace");
    await tick();
    assert.equal(root.textContent, "Hello, Grace");
  });

  it("jsx function components get reactive props", async () => {
    const label = signal("A");

    function Badge(props: { label: string }) {
      const el = document.createElement("span");
      effect(() => {
        el.textContent = props.label;
      });
      return el;
    }

    mount(root, () =>
      jsx(Badge as never, {
        label: () => label(),
      }),
    );
    assert.equal(root.textContent, "A");
    label.set("B");
    await tick();
    assert.equal(root.textContent, "B");
  });

  it("mergeProps applies defaults and overrides", () => {
    const size = signal("lg");
    const props = mergeProps({ size: "md", label: "Go" }, { size });
    assert.equal(props.label, "Go");
    assert.equal(props.size, "lg");
    size.set("sm");
    assert.equal(props.size, "sm");
  });

  it("splitProps separates local and rest", () => {
    const color = signal("red");
    const props = createProps({
      size: "md",
      color,
      class: "x",
    });
    const [local, rest] = splitProps(props, ["size", "color"]);
    assert.equal(local.size, "md");
    assert.equal(local.color, "red");
    assert.equal((rest as { class: string }).class, "x");
    color.set("blue");
    assert.equal(local.color, "blue");
  });
});
