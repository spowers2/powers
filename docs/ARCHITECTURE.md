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

## What is intentionally missing

- Component / JSX runtime
- Stores with nested proxies
- Async `resource()` helpers (Phase 1.x)
- History / time-travel options
- Cross-boundary ownership enforcement (compile-time later)
