# Architecture (Phase 1)

## Reactive graph

```
signal ──notifies──► computed (dirty flag) ──notifies──► effect (queued)
   ▲                      │
   └──── track (on read)──┘
```

1. **Signals** hold values. `.set` / `.update` call `notify` when `equals` says the value changed.
2. **Computeds** mark `dirty` when a source notifies, and recompute lazily on read.
3. **Effects** enqueue on notify and run after the current batch (or on microtask).
4. **Owners** (`createRoot`) own nodes created while active; dispose unlinks the subtree.

## Scheduling

- Writes outside `batch` schedule a microtask flush of dirty effects.
- `batch(fn)` increments a depth counter; the outermost exit flushes synchronously.
- Nested writes during flush may schedule another microtask (rare).

## Ownership

```
createRoot(dispose => {
  // signals, computeds, effects created here are owned
  dispose(); // cleanup + unlink
});
```

Later phases will map component instances and islands onto owners.

## Equality

Default: `Object.is`. Override per signal/computed via `{ equals }` for structural comparisons.

## Store (shallow)

`store({ a, b })` creates one signal per top-level key.  
`app.a` is a full `Signal`. `app()` snapshots all keys (tracks all).  
`app.set({ a, b })` batches writes. Nested objects are opaque values — replace the nest or nest another `store()`.

## Resource

`resource(source, fetcher)` runs under an effect that tracks `source` + an internal refetch tick.  
In-flight promises are version-tokenized so stale settles no-op after dispose or newer requests.  
Source `null | undefined | false` skips the fetch (“wait until ready”).

## Errors

Effects wrap `fn` and cleanups in `try/catch`.  
Resolution order: local `effect(..., { onError })` → owner `onError` handlers (walk parents) → console.

## Size budget

`pnpm size` bundles `@power-ux/core` with esbuild (minify) and fails if gzip exceeds 8 KB.

## App-author contracts

Runtime rules that must not regress (outlet isolation, forms, lists):

→ **[`FOUNDATION.md`](./FOUNDATION.md)**

## What is intentionally missing

- Deep proxy stores (prefer nested shallow stores)
- History / time-travel options
- Cross-boundary ownership enforcement (compile-time later)
