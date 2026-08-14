import { chromium } from "playwright";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

await page.goto("http://127.0.0.1:5173/system#sys-forms", { waitUntil: "networkidle" });
await page.waitForTimeout(500);

// Log all history and hash changes
await page.evaluate(() => {
  const oPush = history.pushState.bind(history);
  const oRep = history.replaceState.bind(history);
  history.pushState = (a,b,u) => { console.log("pushState", u); return oPush(a,b,u); };
  history.replaceState = (a,b,u) => { console.log("replaceState", u); return oRep(a,b,u); };
  window.addEventListener("hashchange", () => console.log("hashchange", location.hash));
  window.addEventListener("popstate", () => console.log("popstate", location.href));
});

page.on("console", (msg) => console.log("C", msg.text()));

await page.locator("#sys-email").click({ timeout: 5000 }).catch(async () => {
  await page.locator("#sys-forms").scrollIntoViewIfNeeded();
  await page.locator("#sys-email").click();
});

// type with logging hash each time
await page.keyboard.type("a");
await page.waitForTimeout(50);
console.log("after type", await page.evaluate(() => ({ hash: location.hash, href: location.href, scroll: window.scrollY, val: document.getElementById("sys-email")?.value })));

await browser.close();
