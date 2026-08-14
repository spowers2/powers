import { chromium } from "playwright";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

await page.goto("http://127.0.0.1:5173/system", { waitUntil: "networkidle" });
await page.locator("#sys-forms").scrollIntoViewIfNeeded();
await page.waitForTimeout(300);

await page.evaluate(() => {
  // Patch history
  const wrap = (name) => {
    const orig = history[name].bind(history);
    history[name] = function(...args) {
      console.log("history." + name, args[2] || args[0]);
      return orig(...args);
    };
  };
  wrap("pushState");
  wrap("replaceState");
  
  // Track if outlet is recreated
  const outlet = document.querySelector("[data-power-router-outlet]");
  const child = outlet?.firstChild;
  window.__childBefore = child;
  
  const obs = new MutationObserver((muts) => {
    for (const m of muts) {
      if (m.type === "childList" && m.target === outlet) {
        console.log("OUTLET children changed", {
          added: m.addedNodes.length,
          removed: m.removedNodes.length,
        });
      }
    }
  });
  if (outlet) obs.observe(outlet, { childList: true });
});

page.on("console", (msg) => console.log("CONSOLE", msg.text()));

await page.locator("#sys-email").click();
await page.keyboard.type("a");
await page.waitForTimeout(200);

const s = await page.evaluate(() => ({
  sameChild: window.__childBefore === document.querySelector("[data-power-router-outlet]")?.firstChild,
  scrollY: window.scrollY,
  href: location.href,
}));
console.log(JSON.stringify(s));

await browser.close();
