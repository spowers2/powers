/**
 * Power Lab — interactive learning playground.
 * Pick a recipe → editor + tip + preview all switch to that sample.
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
  /** Editor source of truth — recipe loads and typing both write here */
  const code = signal(initial?.code ?? startRecipe.code);
  /** Bumps on every recipe switch so the UI can flash “loaded” feedback */
  const loadGen = signal(0);
  const status = signal<"idle" | "running" | "ok" | "error">("idle");
  const statusMsg = signal("Ready — pick a recipe or edit the code");
  const logs = signal<LabLog[]>([]);
  const autoRun = signal(true);

  let iframeEl: HTMLIFrameElement | null = null;
  let editorEl: HTMLTextAreaElement | null = null;
  let tipBodyEl: HTMLElement | null = null;
  let titleEl: HTMLElement | null = null;
  let codeLabelEl: HTMLElement | null = null;
  let runToken = 0;
  let debounceTimer: ReturnType<typeof setTimeout> | null = null;
  /** When true, next code→editor sync is forced even if values look equal */
  let forceEditorWrite = false;

  const activeRecipe = (): Recipe => recipeById(activeId()) ?? recipes[0]!;

  function syncSidebar(active: string) {
    for (const btn of recipeList.querySelectorAll<HTMLButtonElement>(
      ".lab-recipe",
    )) {
      const id = btn.dataset.recipeId ?? "";
      const on = id === active;
      btn.classList.toggle("is-active", on);
      btn.setAttribute("aria-current", on ? "true" : "false");
    }
  }

  function writeEditor(next: string) {
    if (!editorEl) return;
    // Always replace — setAttribute alone does not update a controlled-looking textarea
    editorEl.value = next;
    // Some browsers keep selection at end of previous content; jump to top of recipe
    editorEl.setSelectionRange(0, 0);
    editorEl.scrollTop = 0;
  }

  function applyRecipeChrome(r: Recipe) {
    if (titleEl) titleEl.textContent = r.title;
    if (tipBodyEl) tipBodyEl.textContent = r.tip;
    if (codeLabelEl) codeLabelEl.textContent = `Code · ${r.title}`;
    syncSidebar(r.id);
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
    } else if (result.error === "Cancelled") {
      // superseded by a newer run
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

  /** Switch recipe: chrome + code editor + re-run preview */
  function loadRecipe(r: Recipe) {
    // Cancel in-flight preview
    runToken += 1;
    if (debounceTimer) {
      clearTimeout(debounceTimer);
      debounceTimer = null;
    }

    activeId.set(r.id);
    forceEditorWrite = true;
    code.set(r.code);
    // Write immediately (don’t wait for effect) so the user always sees the swap
    writeEditor(r.code);
    forceEditorWrite = false;

    applyRecipeChrome(r);
    loadGen.update((n) => n + 1);
    statusMsg.set(`Loaded “${r.title}” — code updated`);
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
    forceEditorWrite = true;
    code.set(r.code);
    writeEditor(r.code);
    forceEditorWrite = false;
    statusMsg.set(`Reset “${r.title}”`);
    void run();
  }

  // —— Sidebar recipes (event delegation) ——
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
    btn.setAttribute("aria-label", `Load recipe: ${r.title}`);
    const strong = document.createElement("strong");
    strong.textContent = r.title;
    const span = document.createElement("span");
    span.textContent = r.blurb;
    btn.append(strong, span);
    recipeList.appendChild(btn);
  }

  recipeList.addEventListener("click", (e) => {
    const target = e.target as HTMLElement | null;
    const btn = target?.closest?.(".lab-recipe") as HTMLButtonElement | null;
    if (!btn || !recipeList.contains(btn)) return;
    e.preventDefault();
    const id = btn.dataset.recipeId;
    if (!id) return;
    const r = recipeById(id);
    if (!r) {
      statusMsg.set(`Unknown recipe: ${id}`);
      status.set("error");
      return;
    }
    loadRecipe(r);
  });

  const sidebar = (
    <aside class="lab-sidebar">
      <div class="lab-sidebar-head">
        <h2>Power Lab</h2>
        <Text muted size="xs">
          Click a recipe — the <strong>Code</strong> panel switches to that
          sample, then the preview re-runs.
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

  // —— Editor ——
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

  // Keep textarea in lockstep with the `code` signal (recipe loads + reset)
  effect(() => {
    const next = code();
    loadGen(); // re-run when a recipe is chosen even if code string is identical
    if (!editorEl) return;
    if (forceEditorWrite || editorEl.value !== next) {
      writeEditor(next);
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

  codeLabelEl = document.createElement("div");
  codeLabelEl.className = "lab-pane-label";
  codeLabelEl.textContent = `Code · ${startRecipe.title}`;

  // Flash the code pane when a recipe loads
  effect(() => {
    loadGen();
    const pane = codeLabelEl?.parentElement;
    if (!pane || loadGen() === 0) return;
    pane.classList.remove("lab-editor-pane--flash");
    // reflow so animation restarts
    void pane.offsetWidth;
    pane.classList.add("lab-editor-pane--flash");
  });

  applyRecipeChrome(startRecipe);
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
            {codeLabelEl}
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
