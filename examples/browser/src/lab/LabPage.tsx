/**
 * Power Lab — interactive learning playground.
 * Recipe-first: pick a sample, edit code, live preview.
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
  const statusMsg = signal("Ready — pick a recipe or edit the code");
  const logs = signal<LabLog[]>([]);
  const autoRun = signal(true);

  let iframeEl: HTMLIFrameElement | null = null;
  let editorEl: HTMLTextAreaElement | null = null;
  let tipBodyEl: HTMLElement | null = null;
  let titleEl: HTMLElement | null = null;
  let runToken = 0;
  let debounceTimer: ReturnType<typeof setTimeout> | null = null;

  const activeRecipe = (): Recipe => recipeById(activeId()) ?? recipes[0]!;

  function syncChrome(r: Recipe) {
    if (titleEl) titleEl.textContent = r.title;
    if (tipBodyEl) tipBodyEl.textContent = r.tip;
    for (const btn of recipeList.querySelectorAll<HTMLButtonElement>(".lab-recipe")) {
      const id = btn.dataset.recipeId;
      btn.classList.toggle("is-active", id === r.id);
      btn.setAttribute("aria-current", id === r.id ? "true" : "false");
    }
  }

  async function run() {
    if (!iframeEl) return;
    const token = ++runToken;
    const source = code();
    status.set("running");
    statusMsg.set("Compiling…");
    logs.set([]);

    const result = await runInFrame(
      iframeEl,
      source,
      (log) => {
        if (token !== runToken) return;
        logs.update((list) => [...list, log]);
      },
      token,
      () => runToken,
    );

    if (token !== runToken) return;
    if (result.ok) {
      status.set("ok");
      statusMsg.set("Running · edit code or pick another recipe");
    } else {
      status.set("error");
      statusMsg.set(result.error ?? "Error — see console below");
    }
  }

  function scheduleAutoRun() {
    if (!autoRun()) return;
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      void run();
    }, 450);
  }

  function loadRecipe(r: Recipe) {
    // Cancel in-flight preview work
    runToken += 1;
    if (debounceTimer) {
      clearTimeout(debounceTimer);
      debounceTimer = null;
    }

    activeId.set(r.id);
    code.set(r.code);
    if (editorEl) {
      editorEl.value = r.code;
      editorEl.scrollTop = 0;
    }
    syncChrome(r);
    statusMsg.set(`Loaded “${r.title}”`);
    logs.set([]);
    void run();
  }

  function share() {
    const hash = "lab/" + encodeShare(code(), activeId());
    const path = `${location.pathname}${location.search}#${hash}`;
    history.replaceState(null, "", path);
    const url = `${location.origin}${path}`;
    void navigator.clipboard?.writeText(url).then(
      () => {
        statusMsg.set("Share link copied");
        status.set("ok");
      },
      () => {
        statusMsg.set("Copy failed — URL is in the address bar");
      },
    );
  }

  function resetRecipe() {
    const r = activeRecipe();
    code.set(r.code);
    if (editorEl) {
      editorEl.value = r.code;
      editorEl.scrollTop = 0;
    }
    statusMsg.set(`Reset “${r.title}”`);
    void run();
  }

  // Sidebar recipe list (imperative so click → load is bulletproof)
  const recipeList = document.createElement("div");
  recipeList.className = "lab-recipe-list";
  recipeList.setAttribute("role", "listbox");
  recipeList.setAttribute("aria-label", "Recipes");

  for (const r of recipes) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "lab-recipe";
    btn.dataset.recipeId = r.id;
    btn.setAttribute("role", "option");
    const strong = document.createElement("strong");
    strong.textContent = r.title;
    const span = document.createElement("span");
    span.textContent = r.blurb;
    btn.append(strong, span);
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      loadRecipe(r);
    });
    recipeList.appendChild(btn);
  }

  const sidebar = (
    <aside class="lab-sidebar">
      <div class="lab-sidebar-head">
        <h2>Power Lab</h2>
        <Text muted size="xs">
          Pick a recipe → edit code → live preview. This is the interactive
          teacher (not a static demo page).
        </Text>
      </div>
      <Badge tone="accent">{recipes.length} recipes</Badge>
      {recipeList}
    </aside>
  );

  const auto = document.createElement("label");
  auto.className = "lab-auto";
  const autoInput = document.createElement("input");
  autoInput.type = "checkbox";
  autoInput.checked = true;
  autoInput.addEventListener("change", () => {
    autoRun.set(autoInput.checked);
    if (autoRun()) scheduleAutoRun();
  });
  auto.append(autoInput, document.createTextNode(" Auto-run"));

  titleEl = document.createElement("span");
  titleEl.className = "lab-toolbar-title";
  titleEl.textContent = startRecipe.title;

  const toolbar = (
    <div class="lab-toolbar">
      {titleEl}
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
          `lab-status${status() === "ok" ? " is-ok" : ""}${status() === "error" ? " is-err" : ""}${status() === "running" ? " is-run" : ""}`
        }
      >
        {() => statusMsg()}
      </span>
    </div>
  );

  tipBodyEl = document.createElement("span");
  tipBodyEl.textContent = startRecipe.tip;
  const tip = (
    <p class="lab-tip">
      <strong>Tip · </strong>
      {tipBodyEl}
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
    if (items.length === 0) return;
    for (const line of items) {
      const p = document.createElement("p");
      p.className = `lab-console-line${line.level === "error" ? " is-error" : ""}${line.level === "warn" ? " is-warn" : ""}`;
      p.textContent = `[${line.level}] ${line.args.join(" ")}`;
      consoleEl.appendChild(p);
    }
  });

  // Initial chrome + first run
  syncChrome(startRecipe);
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
