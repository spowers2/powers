# Data — hook any backend

**For UI developers.** Powers is the **interface layer**. Your API (REST, BaaS SDK, GraphQL client) stays yours. No Powers server, no Swagger product — just `resource` / `createQuery` / `createApiClient` and clear UI states.

Live practice: Lab recipes **Data: list** · **Data: detail** · **Data: save form**  
(`https://lab206.com/lab?recipe=data-list`).

---

## One sentence

> **Read with `resource` or `createQuery`. Write with your client (`createApiClient` or SDK). Drive Spinner / Alert / Empty from `loading` · `error` · data.**

---

## Rosetta

| Need | Use |
|---|---|
| Load once / keyed load | `resource` or `createQuery` |
| Loading / error / refetch | `data.loading()` · `data.error()` · `data.refetch()` |
| Shared base URL + auth headers | `createApiClient({ baseUrl, getHeaders })` |
| Create / update | `api.post` / `api.patch` on submit, then `refetch()` |
| List empty | `Empty` when `data()?.length === 0` |

---

## `createApiClient`

```ts
import { createApiClient, createQuery, signal } from "@lab206/core";

const token = signal<string | null>(null);

const api = createApiClient({
  baseUrl: "/api", // or () => import.meta.env.VITE_API_URL
  getHeaders: () => {
    const t = token();
    return t ? { Authorization: `Bearer ${t}` } : {};
  },
});

// api.get / .post / .put / .patch / .delete → JSON, throw ApiError on !ok
```

`ApiError` has `.status` and `.body` for Alert copy.

Pair with queries:

```ts
const users = createQuery({
  queryKey: () => "users",
  queryFn: () => api.get<User[]>("/users"),
});
```

---

## Patterns

### List

```ts
const list = createQuery({
  queryKey: () => `items:${filter()}`,
  queryFn: () => api.get<Item[]>(`/items?q=${encodeURIComponent(filter())}`),
});
// UI: Spinner while list.loading(); Alert if list.error(); Table / Empty when ready
```

### Detail (keyed)

```ts
const id = signal<string | null>(null);
const detail = createQuery({
  queryKey: () => id() ?? false, // idle until selected
  queryFn: (key) => api.get<Item>(`/items/${key}`),
});
```

### Save form then refetch

```ts
async function onSave() {
  saving.set(true);
  error.set(null);
  try {
    await api.post("/items", { name: name() });
    await list.refetch();
  } catch (e) {
    error.set(e instanceof ApiError ? String(e.body ?? e.message) : String(e));
  } finally {
    saving.set(false);
  }
}
```

Prefer **`bind={name}`** on inputs; don’t remount the form from list data on every keystroke (see [FOUNDATION.md](./FOUNDATION.md)).

---

## CORS · same origin · Vite proxy

| Setup | Tip |
|---|---|
| API on same host (`/api/…`) | Simplest — no CORS |
| Dev: API on another port | Vite `server.proxy` → `/api` |
| Separate API origin | Enable CORS on the API; send auth via headers from `getHeaders` |
| Cookie sessions | `credentials: "include"` needs a custom `fetch` wrapper (pass `fetch` into `createApiClient`) |

Powers does not configure your server. Point `baseUrl` at whatever you already run.

---

## What Powers is *not*

- Not an ORM / database layer  
- Not Next.js server actions  
- Not a vendor SDK (Supabase, Firebase, …) — call those from `queryFn` / submit if you want  
- Not OpenAPI/Swagger hosting — document **your** HTTP API separately if you need that  

---

## Practice

| Step | Where |
|---|---|
| Async basics | Lab `/lab?recipe=async` |
| Live keyed query | Lab `/lab?recipe=query` |
| List / detail / save | Lab `data-list` · `data-detail` · `data-form` |
| Five words | [LEARN.md](./LEARN.md) |
| Forms | [FORMS.md](./FORMS.md) · [USABILITY.md](./USABILITY.md) |
