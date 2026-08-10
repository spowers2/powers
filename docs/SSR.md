# `@power-ui/ssr`

## String SSR

```ts
import { renderToString, htmlDocument } from "@power-ui/ssr";
import { h } from "@power-ui/dom";

const body = await renderToString(() => h("h1", { text: "Hello" }));
const page = htmlDocument(body, { title: "Hi" });
```

Uses **happy-dom** on the server. Good for full HTML snapshots and tests.

## Islands (selective hydration)

Static shell stays as HTML. Interactive regions remount on the client.

### Server

```ts
import { renderToString, island, htmlDocument } from "@power-ui/ssr";

const body = await renderToString(() => {
  const main = document.createElement("main");
  main.appendChild(h("h1", { text: "Marketing (static)" }));
  main.appendChild(island("counter", () => Counter()));
  return main;
});
```

Or string shell:

```ts
import { islandPlaceholder } from "@power-ui/ssr";

const body = `
  <h1>Hello</h1>
  ${islandPlaceholder("counter", "Loading…")}
`;
```

### Client

```ts
import { hydrateIslands } from "@power-ui/ssr";

hydrateIslands({
  counter: () => Counter(),
});
```

Islands are marked with `data-pu-island="name"`. Hydration clears the island node and `mount`s the live app.

## Not yet

- Resumability (Qwik-style)  
- Streaming HTML  
- Automatic partial hydration without registry  

GSAP / pro motion remains separate (parked on roadmap).
