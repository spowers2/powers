import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { signal } from "@lab206/core";
import { h, bindText } from "@lab206/dom";
import { renderToString, htmlDocument } from "./index.js";

describe("@lab206/ssr", () => {
  it("renders static elements to HTML", async () => {
    const html = await renderToString(() =>
      h("h1", { text: "Hello SSR" }),
    );
    assert.equal(html, "<h1>Hello SSR</h1>");
  });

  it("renders reactive text after flush", async () => {
    const html = await renderToString(() => {
      const name = signal("Ada");
      const el = h("p");
      bindText(el, () => `Hi ${name()}`);
      return el;
    });
    assert.equal(html, "<p>Hi Ada</p>");
  });

  it("htmlDocument wraps body", () => {
    const doc = htmlDocument("<p>x</p>", { title: "T" });
    assert.ok(doc.includes("<title>T</title>"));
    assert.ok(doc.includes('<div id="app"><p>x</p></div>'));
  });
});
