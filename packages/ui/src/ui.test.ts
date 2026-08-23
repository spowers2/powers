import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { Window } from "happy-dom";
import { mount } from "@lab206/dom";
import { signal } from "@lab206/core";
import { Button } from "./components/Button.js";
import { Input } from "./components/Input.js";
import { Textarea } from "./components/Textarea.js";
import { Select } from "./components/Select.js";
import { Field } from "./components/Field.js";
import { readBool, readProp, readStr } from "./reactive.js";
import { Dialog } from "./components/Dialog.js";
import { Tabs } from "./components/Tabs.js";
import { Progress } from "./components/Progress.js";
import { createToaster, Toaster } from "./components/Toast.js";
import { Menu } from "./components/Menu.js";
import { Popover } from "./components/Popover.js";
import { Combobox } from "./components/Combobox.js";
import { Command } from "./components/Command.js";
import { Accordion } from "./components/Accordion.js";
import { Drawer } from "./components/Drawer.js";
import { Pagination } from "./components/Pagination.js";
import { Stat } from "./components/Stat.js";
import { RadioGroup } from "./components/Radio.js";
import { createStyleSheet, styleVars } from "./styles.js";
import { createTheme } from "./theme.js";
import { cx } from "./utils.js";
import { List } from "./components/List.js";
import {
  applyRovingTabIndex,
  handleRovingKeydown,
  listRovingItems,
} from "./rovingFocus.js";
import {
  emailFormat,
  firstError,
  required,
  validateForm,
  bindInput,
  createField,
  eventValue,
} from "./form.js";
import { installDevWarnings, setDevWarnings } from "./dev.js";
import { MOTION_PRESETS, motionVars } from "./motion.js";

function installDom() {
  const window = new Window({ url: "https://localhost/" });
  const g = globalThis as unknown as Record<string, unknown>;
  g.window = window;
  g.document = window.document;
  g.Node = window.Node;
  g.HTMLElement = window.HTMLElement;
  g.Text = window.Text;
  g.Element = window.Element;
  g.SVGElement = window.SVGElement;
  g.KeyboardEvent = window.KeyboardEvent;
  g.MouseEvent = window.MouseEvent;
  g.Event = window.Event;
  return window.document as unknown as Document;
}

describe("@lab206/ui", () => {
  let document: Document;
  let root: HTMLElement;

  beforeEach(() => {
    document = installDom();
    root = document.createElement("div");
    document.body.appendChild(root);
  });

  it("cx joins classes", () => {
    assert.equal(cx("a", false, "b", { c: true, d: false }), "a b c");
  });

  it("puId is unique per call", async () => {
    const { puId } = await import("./utils.js");
    const a = puId("t");
    const b = puId("t");
    assert.notEqual(a, b);
    assert.match(a, /^t-/);
  });

  it("Button renders with variant class", () => {
    mount(root, () => Button({ children: "Save", variant: "soft" }));
    const btn = root.querySelector("button");
    assert.ok(btn);
    assert.ok(btn!.className.includes("pu-btn--soft"));
    assert.equal(btn!.textContent, "Save");
  });

  it("readProp / readBool / readStr helpers", () => {
    assert.equal(readProp(3), 3);
    assert.equal(readProp(() => 7), 7);
    assert.equal(readBool(true), true);
    assert.equal(readBool(() => false), false);
    assert.equal(readStr(undefined), "");
    assert.equal(readStr(() => "x"), "x");
    const s = signal("hi");
    assert.equal(readStr(s), "hi");
  });

  it("Input is controlled by a signal (typing works)", async () => {
    const { flush } = await import("@lab206/core");
    const email = signal("");
    mount(root, () =>
      Input({
        type: "email",
        value: email,
        onInput: (e) => email.set((e.target as HTMLInputElement).value),
      }),
    );
    const input = root.querySelector("input") as HTMLInputElement;
    assert.ok(input);
    assert.equal(input.value, "");

    // Simulate focus + typing (DOM is source of truth while focused)
    input.focus();
    input.value = "a";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    flush();
    assert.equal(email(), "a");
    assert.equal(input.value, "a");

    input.value = "a@b.co";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    flush();
    assert.equal(email(), "a@b.co");
    assert.equal(input.value, "a@b.co");

    // External set applies after blur
    input.blur();
    email.set("other@x.com");
    flush();
    assert.equal(input.value, "other@x.com");
  });

  it("Input bind={signal} two-way without manual onInput", async () => {
    const { flush } = await import("@lab206/core");
    const name = signal("Sam");
    mount(root, () => Input({ bind: name }));
    const input = root.querySelector("input") as HTMLInputElement;
    assert.equal(input.value, "Sam");
    input.focus();
    input.value = "Sam R";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    flush();
    assert.equal(name(), "Sam R");
    input.blur();
    name.set("");
    flush();
    assert.equal(input.value, "");
  });

  it("installDevWarnings is safe to call", () => {
    setDevWarnings(true);
    installDevWarnings();
    setDevWarnings(false);
  });

  it("bindInput / createField helpers", () => {
    const s = signal("x");
    const props = bindInput(s);
    assert.equal(props.value, s);
    const input = document.createElement("input");
    input.value = "hello";
    props.onInput({ currentTarget: input, target: input } as unknown as Event);
    assert.equal(s(), "hello");
    assert.equal(
      eventValue({ currentTarget: input, target: input } as unknown as Event),
      "hello",
    );

    const field = createField({
      initial: "",
      validate: (v) => required(v, "Need name"),
    });
    assert.equal(field.error(), "");
    field.touch();
    assert.equal(field.error(), "Need name");
    field.set("Ada");
    assert.equal(field.error(), "");
  });

  it("Select tracks value + reactive options without remount", async () => {
    const { flush } = await import("@lab206/core");
    const value = signal("a");
    const opts = signal([
      { value: "a", label: "Alpha" },
      { value: "b", label: "Beta" },
    ]);
    mount(root, () =>
      Select({
        value,
        options: () => opts(),
        onChange: (e) =>
          value.set((e.target as HTMLSelectElement).value),
      }),
    );
    const sel = root.querySelector("select") as HTMLSelectElement;
    assert.ok(sel);
    assert.equal(sel.value, "a");
    assert.equal(sel.options.length, 2);

    value.set("b");
    flush();
    assert.equal(sel.value, "b");

    opts.set([
      { value: "b", label: "Beta" },
      { value: "c", label: "Gamma" },
    ]);
    flush();
    assert.equal(sel.options.length, 2);
    assert.equal(sel.options[1]!.value, "c");
    // keep selection when still present
    assert.equal(sel.value, "b");

    // Value disappears from options → fall back to first option (no blank)
    opts.set([{ value: "c", label: "Gamma" }]);
    flush();
    assert.equal(sel.value, "c");
  });

  it("Button disabled tracks accessor", async () => {
    const { flush } = await import("@lab206/core");
    const locked = signal(true);
    mount(root, () =>
      Button({
        children: "Go",
        disabled: () => locked(),
      }),
    );
    const btn = root.querySelector("button") as HTMLButtonElement;
    assert.equal(btn.disabled, true);
    locked.set(false);
    flush();
    assert.equal(btn.disabled, false);
    locked.set(true);
    flush();
    assert.equal(btn.disabled, true);
  });

  it("Field auto-wires label htmlFor to control id", async () => {
    const { flush } = await import("@lab206/core");
    const email = signal("");
    mount(root, () =>
      Field({
        label: "Work email",
        children: Input({
          value: email,
          onInput: (e) => email.set((e.target as HTMLInputElement).value),
        }),
      }),
    );
    flush();
    await new Promise((r) => setTimeout(r, 10));
    const label = root.querySelector("label.pu-label") as HTMLLabelElement;
    const input = root.querySelector("input.pu-input") as HTMLInputElement;
    assert.ok(label);
    assert.ok(input);
    assert.ok(label.htmlFor, "label should have htmlFor");
    assert.equal(input.id, label.htmlFor, "control id should match label");
  });

  it("Field shows live validation error without role=alert", async () => {
    const { flush } = await import("@lab206/core");
    const email = signal("");
    const err = () =>
      email() && !email().includes("@") ? "Invalid email" : "";
    mount(root, () =>
      Field({
        label: "Email",
        error: err,
        children: Input({
          value: email,
          onInput: (e) => email.set((e.target as HTMLInputElement).value),
        }),
      }),
    );
    flush();
    assert.equal(root.querySelector(".pu-field__error"), null);
    email.set("nope");
    flush();
    await new Promise((r) => setTimeout(r, 10));
    const errEl = root.querySelector(".pu-field__error");
    assert.ok(errEl);
    assert.match(errEl!.textContent ?? "", /Invalid/);
    // Must NOT be role=alert — that scrolls the page while typing
    assert.notEqual(errEl!.getAttribute("role"), "alert");
    const input = root.querySelector("input") as HTMLInputElement;
    assert.equal(input.getAttribute("aria-invalid"), "true");
    assert.ok(input.getAttribute("aria-describedby"));
    email.set("ok@x.com");
    flush();
    assert.equal(root.querySelector(".pu-field__error"), null);
  });

  it("Textarea is controlled by a signal", async () => {
    const { flush } = await import("@lab206/core");
    const note = signal("hi");
    mount(root, () =>
      Textarea({
        value: note,
        onInput: (e) => note.set((e.target as HTMLTextAreaElement).value),
      }),
    );
    const ta = root.querySelector("textarea") as HTMLTextAreaElement;
    assert.equal(ta.value, "hi");
    ta.value = "hello";
    ta.dispatchEvent(new Event("input", { bubbles: true }));
    flush();
    assert.equal(note(), "hello");
    assert.equal(ta.value, "hello");
  });

  it("createTheme sets data attribute", async () => {
    const { flush } = await import("@lab206/core");
    const theme = createTheme("light");
    theme.bind(document.documentElement);
    assert.equal(
      document.documentElement.getAttribute("data-pu-theme"),
      "light",
    );
    theme.setMode("dark");
    await Promise.resolve();
    await Promise.resolve();
    flush();
    assert.equal(
      document.documentElement.getAttribute("data-pu-theme"),
      "dark",
    );
  });

  it("Dialog toggles open class", async () => {
    const { flush } = await import("@lab206/core");
    const open = signal(false);
    mount(root, () =>
      Dialog({ open, onClose: () => open.set(false), title: "Hi", children: "Body" }),
    );
    const rootEl = root.querySelector(".pu-dialog-root");
    assert.ok(rootEl);
    assert.equal(rootEl!.classList.contains("pu-dialog-root--open"), false);
    open.set(true);
    flush();
    assert.equal(rootEl!.classList.contains("pu-dialog-root--open"), true);
  });

  it("Tabs switches panels", async () => {
    const { flush } = await import("@lab206/core");
    mount(root, () =>
      Tabs({
        defaultValue: "a",
        items: [
          { id: "a", label: "A", content: "Panel A" },
          { id: "b", label: "B", content: "Panel B" },
        ],
      }),
    );
    assert.match(root.textContent ?? "", /Panel A/);
    const tabs = root.querySelectorAll('[role="tab"]');
    assert.equal(tabs.length, 2);
    (tabs[1] as HTMLButtonElement).click();
    flush();
    assert.match(root.textContent ?? "", /Panel B/);
  });

  it("Tabs mounts node content without [object HTML…]", async () => {
    const { flush } = await import("@lab206/core");
    const panel = document.createElement("p");
    panel.className = "live-panel";
    panel.textContent = "Node body";
    mount(root, () =>
      Tabs({
        defaultValue: "n",
        items: [{ id: "n", label: "N", content: panel }],
      }),
    );
    flush();
    assert.ok(root.querySelector("p.live-panel"));
    assert.match(root.textContent ?? "", /Node body/);
    assert.equal(root.textContent?.includes("[object"), false);
  });

  it("Progress sets aria-valuenow", async () => {
    const { flush } = await import("@lab206/core");
    const value = signal(25);
    mount(root, () => Progress({ value, label: "Load" }));
    const bar = root.querySelector('[role="progressbar"]');
    assert.ok(bar);
    assert.equal(bar!.getAttribute("aria-valuenow"), "25");
    value.set(80);
    flush();
    assert.equal(bar!.getAttribute("aria-valuenow"), "80");
  });

  it("createToaster pushes items into Toaster", async () => {
    const { flush } = await import("@lab206/core");
    const toaster = createToaster();
    mount(root, () => Toaster({ toaster }));
    assert.equal(root.querySelectorAll(".pu-toast").length, 0);
    toaster.push({ title: "Hello", tone: "success", duration: 0 });
    flush();
    const toasts = root.querySelectorAll(".pu-toast");
    assert.equal(toasts.length, 1);
    assert.match(toasts[0]!.textContent ?? "", /Hello/);
  });

  it("Popover toggles open class", async () => {
    const { flush } = await import("@lab206/core");
    const open = signal(false);
    mount(root, () =>
      Popover({
        open,
        onOpenChange: (v) => open.set(v),
        trigger: "Open",
        children: "Panel body",
      }),
    );
    const el = root.querySelector(".pu-popover");
    assert.ok(el);
    assert.equal(el!.classList.contains("pu-popover--open"), false);
    open.set(true);
    flush();
    assert.equal(el!.classList.contains("pu-popover--open"), true);
  });

  it("Popover closes on Escape", async () => {
    const { flush } = await import("@lab206/core");
    const open = signal(true);
    mount(root, () =>
      Popover({
        open,
        onOpenChange: (v) => open.set(v),
        trigger: "Open",
        children: "Panel body",
      }),
    );
    flush();
    assert.equal(open(), true);
    // Listeners attach on next macrotask (after refs)
    await new Promise((r) => setTimeout(r, 10));
    window.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "Escape",
        bubbles: true,
        cancelable: true,
      }),
    );
    flush();
    assert.equal(open(), false);
  });

  it("Menu renders items when opened", async () => {
    const { flush } = await import("@lab206/core");
    mount(root, () =>
      Menu({
        trigger: "Actions",
        items: [
          { id: "a", label: "Alpha" },
          { id: "b", label: "Beta" },
        ],
      }),
    );
    const trigger = root.querySelector(".pu-popover__trigger");
    assert.ok(trigger);
    (trigger as HTMLElement).click();
    flush();
    assert.match(root.textContent ?? "", /Alpha/);
    assert.match(root.textContent ?? "", /Beta/);
  });

  it("Menu closes on Escape", async () => {
    const { flush } = await import("@lab206/core");
    mount(root, () =>
      Menu({
        trigger: "Actions",
        items: [{ id: "a", label: "Alpha" }],
      }),
    );
    const trigger = root.querySelector(".pu-popover__trigger") as HTMLElement;
    trigger.click();
    flush();
    await new Promise((r) => setTimeout(r, 10));
    assert.ok(root.querySelector(".pu-popover--open"));
    window.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "Escape",
        bubbles: true,
        cancelable: true,
      }),
    );
    flush();
    assert.equal(root.querySelector(".pu-popover--open"), null);
  });

  it("Combobox filters options", async () => {
    const { flush } = await import("@lab206/core");
    const value = signal("");
    mount(root, () =>
      Combobox({
        value,
        onChange: (v) => value.set(v),
        options: [
          { value: "a", label: "Alpha" },
          { value: "b", label: "Beta" },
        ],
      }),
    );
    const input = root.querySelector(".pu-combobox__input") as HTMLInputElement;
    assert.ok(input);
    input.focus();
    input.value = "Be";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    flush();
    assert.match(root.textContent ?? "", /Beta/);
  });

  it("Combobox shows loading and empty states", async () => {
    const { flush } = await import("@lab206/core");
    const value = signal("");
    const loading = signal(true);
    const options = signal<{ value: string; label: string }[]>([]);
    mount(root, () =>
      Combobox({
        value,
        onChange: (v) => value.set(v),
        options,
        loading,
        emptyText: "Nothing here",
        loadingText: "Please wait",
      }),
    );
    const input = root.querySelector(".pu-combobox__input") as HTMLInputElement;
    input.focus();
    flush();
    await new Promise((r) => setTimeout(r, 20));
    assert.match(document.body.textContent ?? "", /Please wait/);

    loading.set(false);
    flush();
    await new Promise((r) => setTimeout(r, 20));
    assert.match(document.body.textContent ?? "", /Nothing here/);

    options.set([{ value: "z", label: "Zulu" }]);
    flush();
    await new Promise((r) => setTimeout(r, 20));
    assert.match(document.body.textContent ?? "", /Zulu/);
  });

  it("Command opens and lists items", async () => {
    const { flush } = await import("@lab206/core");
    const open = signal(true);
    mount(root, () =>
      Command({
        open,
        onOpenChange: (v) => open.set(v),
        items: [{ id: "go", label: "Go somewhere" }],
      }),
    );
    flush();
    await new Promise((r) => setTimeout(r, 10));
    assert.ok(root.querySelector(".pu-command-root--open"));
    assert.match(root.textContent ?? "", /Go somewhere/);
  });

  it("Command shows loading state", async () => {
    const { flush } = await import("@lab206/core");
    const open = signal(true);
    const loading = signal(true);
    mount(root, () =>
      Command({
        open,
        onOpenChange: (v) => open.set(v),
        items: [],
        loading,
        loadingText: "Fetching commands",
      }),
    );
    flush();
    await new Promise((r) => setTimeout(r, 10));
    assert.match(root.textContent ?? "", /Fetching commands/);
  });

  it("createStyleSheet injects once", () => {
    const ensure = createStyleSheet("test-sheet", ".pu-test-sheet{color:red}");
    ensure(document);
    ensure(document);
    const sheets = document.querySelectorAll('style[data-pu-ui="test-sheet"]');
    assert.equal(sheets.length, 1);
  });

  it("styleVars builds custom properties", () => {
    assert.deepEqual(
      styleVars({ "pu-color-accent": "#69BE28", radius: "8px" }),
      { "--pu-color-accent": "#69BE28", "--radius": "8px" },
    );
  });

  it("Accordion toggles open item", async () => {
    const { flush } = await import("@lab206/core");
    mount(root, () =>
      Accordion({
        single: true,
        defaultValue: ["a"],
        items: [
          { id: "a", title: "One", content: "Body A" },
          { id: "b", title: "Two", content: "Body B" },
        ],
      }),
    );
    flush();
    const itemA = root.querySelectorAll(".pu-accordion__item")[0];
    assert.ok(itemA?.classList.contains("is-open"));
    const triggers = root.querySelectorAll(".pu-accordion__trigger");
    (triggers[1] as HTMLButtonElement).click();
    flush();
    assert.ok(
      root.querySelectorAll(".pu-accordion__item")[1]?.classList.contains("is-open"),
    );
    assert.equal(
      root.querySelectorAll(".pu-accordion__item")[0]?.classList.contains("is-open"),
      false,
    );
  });

  it("Drawer opens with open class", async () => {
    const { flush } = await import("@lab206/core");
    const open = signal(false);
    mount(root, () =>
      Drawer({ open, onClose: () => open.set(false), title: "Side", children: "In" }),
    );
    const el = root.querySelector(".pu-drawer-root");
    assert.ok(el);
    assert.equal(el!.classList.contains("pu-drawer-root--open"), false);
    open.set(true);
    flush();
    assert.equal(el!.classList.contains("pu-drawer-root--open"), true);
  });

  it("Pagination invokes onChange", async () => {
    const { flush } = await import("@lab206/core");
    const page = signal(1);
    mount(root, () =>
      Pagination({
        page,
        pageCount: 5,
        onChange: (p) => page.set(p),
      }),
    );
    flush();
    const next = root.querySelector('[aria-label="Next page"]') as HTMLButtonElement;
    next.click();
    flush();
    assert.equal(page(), 2);
  });

  it("Stat renders value", () => {
    mount(root, () => Stat({ label: "Users", value: "1.2k", delta: "+3%", tone: "positive" }));
    assert.match(root.textContent ?? "", /Users/);
    assert.match(root.textContent ?? "", /1\.2k/);
    assert.match(root.textContent ?? "", /\+3%/);
  });

  it("RadioGroup selects option", async () => {
    const { flush } = await import("@lab206/core");
    const value = signal("a");
    mount(root, () =>
      RadioGroup({
        value,
        onChange: (v) => value.set(v),
        options: [
          { value: "a", label: "Alpha" },
          { value: "b", label: "Beta" },
        ],
      }),
    );
    flush();
    const inputs = root.querySelectorAll('input[type="radio"]');
    assert.equal(inputs.length, 2);
    (inputs[1] as HTMLInputElement).click();
    // onChange from click may need input event in some envs
    (inputs[1] as HTMLInputElement).checked = true;
    inputs[1]!.dispatchEvent(new Event("change", { bubbles: true }));
    flush();
    assert.equal(value(), "b");
  });

  it("rovingFocus applies single tabIndex 0", () => {
    const a = document.createElement("button");
    const b = document.createElement("button");
    const c = document.createElement("button");
    root.append(a, b, c);
    applyRovingTabIndex([a, b, c], 1);
    assert.equal(a.tabIndex, -1);
    assert.equal(b.tabIndex, 0);
    assert.equal(c.tabIndex, -1);
  });

  it("rovingFocus ArrowDown moves focus", () => {
    const host = document.createElement("div");
    const a = document.createElement("button");
    a.setAttribute("role", "menuitem");
    a.textContent = "A";
    const b = document.createElement("button");
    b.setAttribute("role", "menuitem");
    b.textContent = "B";
    host.append(a, b);
    root.append(host);
    applyRovingTabIndex([a, b], 0);
    a.focus();
    const e = new KeyboardEvent("keydown", {
      key: "ArrowDown",
      bubbles: true,
      cancelable: true,
    });
    const handled = handleRovingKeydown(e, host, '[role="menuitem"]', {
      orientation: "vertical",
    });
    assert.equal(handled, true);
    assert.equal(document.activeElement, b);
    assert.equal(b.tabIndex, 0);
    assert.equal(a.tabIndex, -1);
  });

  it("Tabs ArrowRight activates next tab", async () => {
    const { flush } = await import("@lab206/core");
    mount(root, () =>
      Tabs({
        defaultValue: "a",
        items: [
          { id: "a", label: "A", content: "Panel A" },
          { id: "b", label: "B", content: "Panel B" },
        ],
      }),
    );
    flush();
    await new Promise((r) => setTimeout(r, 10));
    const list = root.querySelector('[role="tablist"]') as HTMLElement;
    const tabs = listRovingItems(list, '[role="tab"]:not([disabled])');
    assert.equal(tabs.length, 2);
    tabs[0]!.focus();
    list.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "ArrowRight",
        bubbles: true,
        cancelable: true,
      }),
    );
    flush();
    assert.match(root.textContent ?? "", /Panel B/);
    // bindAttr maps boolean true → attribute present with ""
    const selected = root.querySelector(
      ".pu-tabs__tab--active",
    ) as HTMLElement | null;
    assert.ok(selected);
    assert.equal(selected!.id.replace(/^pu-tab-/, ""), "b");
  });

  it("Menu ArrowDown + Enter selects item", async () => {
    const { flush } = await import("@lab206/core");
    let picked = "";
    mount(root, () =>
      Menu({
        trigger: "Actions",
        items: [
          { id: "edit", label: "Edit" },
          { id: "dup", label: "Duplicate" },
        ],
        onSelect: (id) => {
          picked = id;
        },
      }),
    );
    const trigger = root.querySelector(".pu-popover__trigger") as HTMLElement;
    trigger.click();
    flush();
    await new Promise((r) => setTimeout(r, 20));
    const menu = root.querySelector('[role="menu"]') as HTMLElement;
    assert.ok(menu);
    const items = listRovingItems(menu, '[role="menuitem"]:not([disabled])');
    assert.ok(items.length >= 2);
    items[0]!.focus();
    menu.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "ArrowDown",
        bubbles: true,
        cancelable: true,
      }),
    );
    flush();
    menu.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "Enter",
        bubbles: true,
        cancelable: true,
      }),
    );
    flush();
    assert.equal(picked, "dup");
  });

  it("List ArrowDown + Enter selects", async () => {
    const { flush } = await import("@lab206/core");
    const value = signal("a");
    mount(root, () =>
      List({
        value,
        onSelect: (id) => value.set(id),
        items: [
          { id: "a", label: "Alpha" },
          { id: "b", label: "Beta" },
        ],
      }),
    );
    flush();
    await new Promise((r) => setTimeout(r, 10));
    const list = root.querySelector('[role="listbox"]') as HTMLElement;
    const opts = listRovingItems(list, '[role="option"]:not([disabled])');
    assert.equal(opts.length, 2);
    opts[0]!.focus();
    list.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "ArrowDown",
        bubbles: true,
        cancelable: true,
      }),
    );
    flush();
    list.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "Enter",
        bubbles: true,
        cancelable: true,
      }),
    );
    flush();
    assert.equal(value(), "b");
  });

  it("Dialog open traps focus class + panel", async () => {
    const { flush } = await import("@lab206/core");
    const open = signal(true);
    mount(root, () =>
      Dialog({
        open,
        onClose: () => open.set(false),
        title: "Confirm",
        children: "Body",
      }),
    );
    flush();
    await new Promise((r) => setTimeout(r, 10));
    assert.ok(root.querySelector(".pu-dialog-root--open"));
    assert.ok(root.querySelector('[role="dialog"]'));
    assert.match(root.textContent ?? "", /Confirm/);
  });

  it("form helpers: required + emailFormat + firstError", () => {
    assert.equal(required(""), "Required");
    assert.equal(required("hi"), "");
    assert.equal(emailFormat("nope"), "Enter a valid email");
    assert.equal(emailFormat("a@b.co"), "");
    assert.equal(
      firstError(required(""), emailFormat("x")),
      "Required",
    );
    assert.equal(
      firstError("", emailFormat("bad")),
      "Enter a valid email",
    );
  });

  it("validateForm aggregates field errors", () => {
    const r = validateForm({
      email: () => emailFormat("x"),
      name: () => required(""),
    });
    assert.equal(r.ok, false);
    assert.equal(r.errors.name, "Required");
    assert.ok(r.errors.email);
  });

  it("motion presets include fade and collapse", () => {
    const names = MOTION_PRESETS.map((p) => p.name);
    assert.ok(names.includes("pu-fade"));
    assert.ok(names.includes("pu-collapse"));
    const vars = motionVars({ duration: 200, ease: "spring" });
    assert.equal(vars["--pu-motion-duration"], "200ms");
    assert.match(vars["--pu-motion-ease"] ?? "", /spring|ease/);
  });
});
