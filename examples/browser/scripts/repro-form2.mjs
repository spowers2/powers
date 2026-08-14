import { chromium } from "playwright";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

await page.goto("http://127.0.0.1:5173/system", { waitUntil: "networkidle" });
await page.locator("#sys-forms").scrollIntoViewIfNeeded();
await page.waitForTimeout(300);

// Mark the input element
await page.evaluate(() => {
  const el = document.getElementById("sys-email");
  el.dataset.marker = "A";
  // Observe if removed
  const obs = new MutationObserver((muts) => {
    for (const m of muts) {
      for (const n of m.removedNodes) {
        if (n.dataset?.marker === "A" || (n.querySelector && n.querySelector("[data-marker=A]"))) {
          console.log("REMOVED input or ancestor", m.target);
          window.__removed = true;
        }
      }
    }
  });
  obs.observe(document.body, { childList: true, subtree: true });
  window.__removed = false;
  window.__scrollLog = [];
  window.addEventListener("scroll", () => {
    window.__scrollLog.push(window.scrollY);
  }, true);
  // intercept scrollTo
  const orig = window.scrollTo.bind(window);
  window.scrollTo = (...args) => {
    console.log("scrollTo called", JSON.stringify(args));
    window.__scrollToArgs = args;
    return orig(...args);
  };
  const origInto = Element.prototype.scrollIntoView;
  Element.prototype.scrollIntoView = function(...args) {
    console.log("scrollIntoView", this.id || this.className, args);
    return origInto.apply(this, args);
  };
});

page.on("console", (msg) => console.log("CONSOLE", msg.text()));

const email = page.locator("#sys-email");
await email.click();
await page.keyboard.type("a");
await page.waitForTimeout(100);

const state = await page.evaluate(() => ({
  scrollY: window.scrollY,
  value: document.getElementById("sys-email")?.value,
  marker: document.getElementById("sys-email")?.dataset.marker,
  removed: window.__removed,
  scrollLog: window.__scrollLog?.slice(0, 20),
  scrollToArgs: window.__scrollToArgs,
  activeId: document.activeElement?.id,
  hash: location.hash,
  outletHTML: document.querySelector("[data-power-router-outlet]")?.childElementCount,
}));
console.log(JSON.stringify(state, null, 2));

await browser.close();
