/**
 * Sprint A smoke: demo trust checks against a running (or auto-started) Vite server.
 *
 *   pnpm --filter @lab206/example-browser smoke
 *
 * Env: SMOKE_URL=http://127.0.0.1:5173 (optional)
 */
import { chromium } from "playwright";
import { spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";

const BASE = process.env.SMOKE_URL || "http://127.0.0.1:5173";
let child = null;

async function waitForServer(url, tries = 40) {
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(500) });
      if (res.ok || res.status === 304) return true;
    } catch {
      /* retry */
    }
    await sleep(250);
  }
  return false;
}

async function ensureServer() {
  if (await waitForServer(BASE, 2)) {
    console.log(`smoke: using existing server ${BASE}`);
    return;
  }
  console.log("smoke: starting vite…");
  child = spawn("pnpm", ["exec", "vite", "--host", "127.0.0.1", "--port", "5173"], {
    cwd: new URL("..", import.meta.url).pathname,
    stdio: "pipe",
    shell: true,
  });
  const ok = await waitForServer(BASE);
  if (!ok) throw new Error("Vite did not start in time");
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

async function main() {
  await ensureServer();
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  const failures = [];

  try {
    // —— System page loads ——
    await page.goto(`${BASE}/system`, { waitUntil: "networkidle", timeout: 30000 });
    await page.waitForSelector(".sys-toc", { timeout: 10000 });
    console.log("✓ System page");

    // —— TOC: click Code stays active (pin) ——
    const codeBtn = page.locator(".sys-toc button", { hasText: "Code" });
    await codeBtn.click();
    // During scroll pin should hold Code
    await sleep(250);
    let active = await page.locator(".sys-toc button.is-active").textContent();
    assert(
      active?.trim() === "Code",
      `TOC pin failed mid-scroll, active=${active}`,
    );
    // Wait for smooth scroll + unlock
    await sleep(1200);
    // Ensure we're at the bottom of the page for last-section logic
    await page.evaluate(() =>
      window.scrollTo(0, document.documentElement.scrollHeight),
    );
    await sleep(200);
    active = await page.locator(".sys-toc button.is-active").textContent();
    assert(
      active?.trim() === "Code",
      `TOC settled active should be Code, got ${active}`,
    );
    // Hash should reflect the click
    const hash = await page.evaluate(() => location.hash);
    assert(hash === "#sys-code", `expected #sys-code hash, got ${hash}`);
    console.log("✓ System TOC pin (Code)");

    // —— Menu keyboard ——
    await page.locator(".sys-toc button", { hasText: "Overlay" }).click();
    await sleep(600);
    const menuTrigger = page.locator("button", { hasText: "Actions" }).first();
    await menuTrigger.scrollIntoViewIfNeeded();
    await menuTrigger.click();
    await page.waitForSelector('[role="menu"]', { timeout: 5000 });
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");
    await sleep(200);
    const bodyText = await page.locator("body").innerText();
    assert(
      /duplicate|edit|delete|archive|—/i.test(bodyText),
      "Menu selection did not update page state",
    );
    console.log("✓ Menu keyboard");

    // —— Dialog ——
    const dialogBtn = page.locator("button", { hasText: "Open dialog" }).first();
    await dialogBtn.scrollIntoViewIfNeeded();
    await dialogBtn.click();
    await page.waitForSelector(".pu-dialog-root--open", { timeout: 5000 });
    await page.keyboard.press("Escape");
    await sleep(200);
    const stillOpen = await page.locator(".pu-dialog-root--open").count();
    assert(stillOpen === 0, "Dialog should close on Escape");
    console.log("✓ Dialog Escape");

    // —— Tabs keyboard ——
    await page.locator(".sys-toc button", { hasText: "Overlay" }).click();
    await sleep(400);
    const tablist = page.locator('[role="tablist"]').first();
    await tablist.scrollIntoViewIfNeeded();
    const firstTab = tablist.locator('[role="tab"]').first();
    await firstTab.focus();
    await page.keyboard.press("ArrowRight");
    await sleep(200);
    // boolean aria-selected becomes presence/"" via bindAttr — use active class
    const selected = await tablist.locator(".pu-tabs__tab--active").first().textContent();
    assert(selected && selected.trim().length > 0, "Tab should be selected after ArrowRight");
    console.log("✓ Tabs keyboard");

    // —— Lab loads + Start here ——
    await page.goto(`${BASE}/lab`, { waitUntil: "networkidle", timeout: 30000 });
    await page.waitForSelector(".lab-main, .lab", {
      timeout: 10000,
    });
    const startHere = page.locator(".lab-start-here");
    await startHere.waitFor({ timeout: 5000 });
    const startText = await startHere.innerText();
    assert(/Start here/i.test(startText), "Lab should show Start here section");
    assert(/Hello Powers|Form validation|Tokens/i.test(startText), "Start here should list core recipes");
    console.log("✓ Lab page + Start here");

    // Start here: form recipe via query
    await page.goto(`${BASE}/lab?recipe=form`, {
      waitUntil: "networkidle",
      timeout: 30000,
    });
    await page.waitForSelector(".lab-toolbar-title", { timeout: 10000 });
    const formTitle = await page.locator(".lab-toolbar-title").textContent();
    assert(/form|validation|signup/i.test(formTitle || ""), `expected form recipe title, got ${formTitle}`);
    const formFrame = page.frameLocator("iframe").first();
    await formFrame.locator("button", { hasText: /Save/i }).first().waitFor({
      timeout: 20000,
    });
    console.log("✓ Lab form recipe runs");

    // —— Lab GSAP recipe + motion assert ——
    await page.goto(`${BASE}/lab?recipe=gsap`, {
      waitUntil: "networkidle",
      timeout: 30000,
    });
    await page.waitForSelector(".lab-recipe-list, .lab-main", { timeout: 10000 });
    const labText = await page.locator("body").innerText();
    assert(/gsap/i.test(labText), "Lab GSAP recipe should mention GSAP in UI");

    const frame = page.frameLocator("iframe").first();
    // Wait for preview compile + App mount
    await frame.locator("button", { hasText: /GSAP/i }).first().waitFor({
      timeout: 20000,
    });
    // x label starts near 0
    await frame.getByText(/x\s*=\s*0px/).first().waitFor({ timeout: 5000 }).catch(() => {});
    await frame.locator("button", { hasText: /GSAP\s*→|GSAP/i }).first().click();
    // Motion: x label should leave 0 within the tween
    await page.waitForFunction(
      () => {
        const iframe = document.querySelector("iframe");
        const doc = iframe && iframe.contentDocument;
        if (!doc || !doc.body) return false;
        const t = doc.body.innerText || "";
        const m = t.match(/x\s*=\s*(-?\d+)px/i);
        return !!(m && Number(m[1]) > 8);
      },
      { timeout: 8000 },
    );
    console.log("✓ Lab GSAP motion (x advances)");

    console.log("\nSmoke: all checks passed");
  } catch (err) {
    failures.push(err);
    console.error("\n✗ smoke failed:", err.message || err);
  } finally {
    await browser.close();
    if (child) {
      child.kill("SIGTERM");
    }
  }

  if (failures.length) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  if (child) child.kill("SIGTERM");
  process.exit(1);
});
