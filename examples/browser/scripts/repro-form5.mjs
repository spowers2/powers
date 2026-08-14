import { chromium } from "playwright";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

// Go without hash first
await page.goto("http://127.0.0.1:5173/system", { waitUntil: "networkidle" });
await page.waitForTimeout(300);
await page.locator("#sys-forms").scrollIntoViewIfNeeded();
await page.waitForTimeout(200);

await page.evaluate(() => {
  const outlet = document.querySelector("[data-power-router-outlet]");
  let n = 0;
  new MutationObserver((muts) => {
    for (const m of muts) {
      if (m.target === outlet && (m.addedNodes.length || m.removedNodes.length)) {
        n++;
        console.log("OUTLET_MUTATION", n, "added", m.addedNodes.length, "removed", m.removedNodes.length, "scroll", window.scrollY);
      }
    }
  }).observe(outlet, { childList: true });

  // Watch path-related
  const oRep = history.replaceState.bind(history);
  history.replaceState = (a,b,u) => {
    console.log("replaceState", String(u), "scroll", window.scrollY);
    return oRep(a,b,u);
  };
});

page.on("console", (msg) => console.log(msg.text()));

const email = page.locator("#sys-email");
await email.click();
console.log("clicked, scroll", await page.evaluate(() => window.scrollY));

// Use pressSequentially 
await email.pressSequentially("ab", { delay: 100 });
await page.waitForTimeout(300);

console.log("final", await page.evaluate(() => ({
  scroll: window.scrollY,
  val: document.getElementById("sys-email")?.value,
  active: document.activeElement?.id,
  hash: location.hash,
})));

await browser.close();
