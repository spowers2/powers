import { chromium } from "playwright";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

page.on("console", (msg) => console.log("CONSOLE", msg.type(), msg.text()));
page.on("pageerror", (err) => console.log("PAGEERROR", err.message));

await page.goto("http://127.0.0.1:5173/system", { waitUntil: "networkidle", timeout: 30000 });

await page.locator("#sys-forms").scrollIntoViewIfNeeded();
await page.waitForTimeout(400);

const email = page.locator("#sys-email");
await email.click();
const scrollBefore = await page.evaluate(() => window.scrollY);
console.log("scrollBefore", scrollBefore);
console.log("focused", await page.evaluate(() => document.activeElement?.id));

for (const ch of "test@x.com") {
  await page.keyboard.type(ch, { delay: 30 });
  const val = await email.inputValue().catch((e) => "GONE:" + e.message);
  const scroll = await page.evaluate(() => window.scrollY);
  const focused = await page.evaluate(() => document.activeElement?.id);
  const same = await page.evaluate(() => {
    const el = document.getElementById("sys-email");
    return { exists: !!el, isActive: document.activeElement === el };
  });
  console.log(JSON.stringify({ ch, val, scroll, focused, same, delta: scroll - scrollBefore }));
}

console.log("--- notes ---");
const notes = page.locator("#sys-notes");
await notes.click();
const sb = await page.evaluate(() => window.scrollY);
await page.keyboard.type("hello notes", { delay: 30 });
console.log("notes value", await notes.inputValue());
console.log("notes scroll delta", await page.evaluate(() => window.scrollY) - sb);

await browser.close();
