/**
 * Power Lab — interactive learning playground.
 * Our own take on CodePen/JSFiddle: Power-UI-native, recipe-first, shareable.
 */
import { signal, effect } from "@power-ui/core";
import { Button, Badge, Text } from "@power-ui/ui";
import { recipes, recipeById, type Recipe } from "./recipes.js";
import {
  runInFrame,
  encodeShare,
  decodeShare,
  type LabLog,
} from "./runner.js";
import "./lab.css";

export function LabPage() {
  const initial =
    typeof location !== "undefined" ? decodeShare(location.hash) : null;

  const startRecipe =
    (initial?.recipeId && recipeById(initial.recipeId)) || recipes[0]!;

  const activeId = signal(startRecipe.id);
  const code = signal(initial?.code ?? startRecipe.code);
  const status = signal<"idle" | "running" | "ok" | "error">("idle");
  const statusMsg = signal("Ready — Run or ⌘/Ctrl+Enter");
  const logs = signal<LabLog[]>([]);
  const autoRun = signal(true);

  let iframeEl: HTMLIFrameElement | null = null;
  let editorEl: HTMLTextAreaElement | null = null;
  let runToken = 0;
  let debounceTimer: ReturnType<typeof setTimeout> | null = null;

  const activeRecipe = () => recipeById(activeId()) ?? recipes[0]!;

  async function run() {
    if (!iframeEl) return;
    const token = ++runToken;
    status.set("running");
    statusMsg.set("Compiling…");
    logs.set([]);

    const result = await runInFrame(iframeEl, code(), (log) => {
      logs.update((list) => [...list, log]);
    });

    if (token !== runToken) return;
    if (result.ok) {
      status.set("ok");
      statusMsg.set("Running");
    } else {
      status.set("error");
      statusMsg.set(result.error ?? "Error");
    }
  }

  function scheduleAutoRun() {
    if (!autoRun()) return;
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      void run();
    }, 550);
  }

  function loadRecipe(r: Recipe) {
    activeId.set(r.id);
    code.set(r.code);
    if (editorEl) editorEl.value = r.code;
    void run();
  }

  function share() {
    const hash = "lab/" + encodeShare(code(), activeId());
    history.replaceState(null, "", `#${hash}`);
    const url = `${location.origin}${location.pathname}#${hash}`;
    void navigator.clipboard?.writeText(url);
    statusMsg.set("Share link copied");
    status.set("ok");
  }

  function resetRecipe() {
    const r = activeRecipe();
    code.set(r.code);
    if (editorEl) editorEl.value = r.code;
    void run();
  }

  // Sidebar recipes
  const recipeList = document.createElement("div");
  recipeList.style.display = "flex";
  recipeList.style.flexDirection = "column";
  recipeList.style.gap = "0.35rem";
  for (const r of recipes) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "lab-recipe";
    const strong = document.createElement("strong");
    strong.textContent = r.title;
    const span = document.createElement("span");
    span.textContent = r.blurb;
    btn.append(strong, span);
    btn.addEventListener("click", () => loadRecipe(r));
    effect(() => {
      btn.classList.toggle("is-active", activeId() === r.id);
    });
    recipeList.appendChild(btn);
  }

  const sidebar = (
    <aside class="lab-sidebar">
      <div>
        <h2>Power Lab</h2>
        <Text muted size="xs">
          Learn by editing — live preview, no account, no build step.
        </Text>
      </div>
      <Badge tone="accent">Made for Power UI</Badge>
      {recipeList}
    </aside>
  );

  // Auto-run checkbox
  const auto = document.createElement("label");
  auto.className = "lab-status";
  auto.style.display = "inline-flex";
  auto.style.gap = "0.35rem";
  auto.style.alignItems = "center";
  const autoInput = document.createElement("input");
  autoInput.type = "checkbox";
  autoInput.checked = true;
  autoInput.addEventListener("change", () => {
    autoRun.set(autoInput.checked);
    if (autoRun()) scheduleAutoRun();
  });
  auto.append(autoInput, document.createTextNode("Auto-run"));

  const toolbar = (
    <div class="lab-toolbar">
      <span class="lab-toolbar-title">{() => activeRecipe().title}</span>
      {auto}
      <Button size="sm" onClick={() => void run()}>
        Run
      </Button>
      <Button size="sm" variant="ghost" onClick={resetRecipe}>
        Reset
      </Button>
      <Button size="sm" variant="soft" onClick={share}>
        Copy share link
      </Button>
      <span
        class={() =>
          `lab-status${status() === "ok" ? " is-ok" : ""}${status() === "error" ? " is-err" : ""}`
        }
      >
        {() => statusMsg()}
      </span>
    </div>
  );

  const tip = (
    <p class="lab-tip">
      <strong>Tip · </strong>
      <span>{() => activeRecipe().tip}</span>
    </p>
  );

  const editor = document.createElement("textarea");
  editor.className = "lab-editor";
  editor.spellcheck = false;
  editor.setAttribute("aria-label", "Power Lab code editor");
  editor.value = code();
  editorEl = editor;
  editor.addEventListener("input", () => {
    code.set(editor.value);
    scheduleAutoRun();
  });
  editor.addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      void run();
    }
    if (e.key === "Tab") {
      e.preventDefault();
      const start = editor.selectionStart;
      const end = editor.selectionEnd;
      const v = editor.value;
      editor.value = `${v.slice(0, start)}  ${v.slice(end)}`;
      editor.selectionStart = editor.selectionEnd = start + 2;
      code.set(editor.value);
    }
  });

  const iframe = document.createElement("iframe");
  iframe.className = "lab-preview";
  iframe.title = "Power Lab preview";
  iframe.setAttribute(
    "sandbox",
    "allow-scripts allow-same-origin allow-modals",
  );
  iframeEl = iframe;

  const consoleEl = document.createElement("div");
  consoleEl.className = "lab-console";
  consoleEl.setAttribute("aria-label", "Lab console");
  effect(() => {
    const items = logs();
    consoleEl.replaceChildren();
    for (const line of items) {
      const p = document.createElement("p");
      p.className = `lab-console-line${line.level === "error" ? " is-error" : ""}${line.level === "warn" ? " is-warn" : ""}`;
      p.textContent = line.args.join(" ");
      consoleEl.appendChild(p);
    }
  });

  queueMicrotask(() => {
    void run();
  });

  return (
    <div class="lab">
      {sidebar}
      <div class="lab-main">
        {toolbar}
        {tip}
        <div class="lab-workspace">
          <div class="lab-editor-pane">
            <div class="lab-pane-label">Code</div>
            {editor}
          </div>
          <div class="lab-preview-pane">
            <div class="lab-pane-label">Live preview</div>
            {iframe}
          </div>
        </div>
        {consoleEl}
      </div>
    </div>
  );
}
