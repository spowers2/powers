# `@power-ui/ssr`

## String SSR

```ts
import { renderToString, htmlDocument } from "@power-ui/ssr";
import { h } from "@power-ui/dom";

const body = await renderToString(() => h("h1", { text: "Hello" }));
const page = htmlDocument(body, { title: "Hi" });
```

Uses **happy-dom** on the server.

## Islands (selective hydration)

Static shell stays as HTML. Interactive regions remount on the client.

### Server

```ts
import { renderToString, island } from "@power-ui/ssr";

const body = await renderToString(() => {
  const main = document.createElement("main");
  main.appendChild(h("h1", { text: "Marketing (static)" }));
  main.appendChild(island("counter", () => Counter()));
  return main;
});
```

Or string shell:

```ts
import { islandPlaceholder, listIslandsInHtml } from "@power-ui/ssr";

const body = `
  <h1>Hello</h1>
  ${islandPlaceholder("counter", "Loading…")}
`;
listIslandsInHtml(body); // ["counter"]
```

### Client — registry API (recommended)

```ts
import { defineIslands } from "@power-ui/ssr";

const islands = defineIslands({
  counter: () => Counter(),
  cart: () => CartWidget(),
});

// After HTML is in the document:
islands.hydrate();

// Diagnostics
islands.discover();           // names in the DOM
islands.missingInRegistry();  // DOM islands without factories
islands.missingInDom();       // factories with no matching DOM node
```

Low-level:

```ts
import { hydrateIslands } from "@power-ui/ssr";

hydrateIslands(
  { counter: () => Counter() },
  {
    root: document,
    onMissing: (name) => console.error("no factory", name),
    preserveOnMissing: true,
  },
);
```

Islands use `data-pu-island="name"`. Hydration clears the node and `mount`s the live app.

### Example

```bash
pnpm example:ssr-islands
```

## Not yet

- Streaming HTML  
- Auto codegen of registries from imports  
- Resumability (Qwik-style) without remount  

GSAP / pro motion remains separate (parked on roadmap).
