# `@lab206/ssr`

## String SSR

```ts
import { renderToString, htmlDocument } from "@lab206/ssr";
import { h } from "@lab206/dom";

const body = await renderToString(() => h("h1", { text: "Hello" }));
const page = htmlDocument(body, { title: "Hi" });
```

Uses **happy-dom** on the server.

## Islands (selective hydration)

Static shell stays as HTML. Interactive regions remount on the client.

### Server

```ts
import { renderToString, island } from "@lab206/ssr";

const body = await renderToString(() => {
  const main = document.createElement("main");
  main.appendChild(h("h1", { text: "Marketing (static)" }));
  main.appendChild(island("counter", () => Counter()));
  return main;
});
```

Or string shell:

```ts
import { islandPlaceholder, listIslandsInHtml } from "@lab206/ssr";

const body = `
  <h1>Hello</h1>
  ${islandPlaceholder("counter", "Loading…")}
`;
listIslandsInHtml(body); // ["counter"]
```

### Client — registry API (recommended)

```ts
import { defineIslands } from "@lab206/ssr";

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
import { hydrateIslands } from "@lab206/ssr";

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
