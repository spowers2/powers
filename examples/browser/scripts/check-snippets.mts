import { compileLabCode } from "../src/lab/runner.ts";
import { SNIPPETS } from "../src/sysDemo.tsx";

async function main() {
  let fail = 0;
  for (const k of Object.keys(SNIPPETS) as (keyof typeof SNIPPETS)[]) {
    try {
      await compileLabCode(SNIPPETS[k]);
      console.log("OK", k);
    } catch (e) {
      fail++;
      console.error("FAIL", k, e instanceof Error ? e.message : e);
    }
  }
  process.exit(fail ? 1 : 0);
}
main();
