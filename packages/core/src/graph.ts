import type { Dispose, NodeKind } from "./types.js";
import { enqueue } from "./scheduler.js";

/** A node in the reactive dependency graph. */
export interface ReactiveNode {
  kind: NodeKind;
  name?: string;
  disposed: boolean;
  pending: boolean;
  /** Sources this node currently depends on. */
  sources: Set<ReactiveNode>;
  /** Nodes that depend on this node. */
  observers: Set<ReactiveNode>;
  /** For computed: dirty when a source may have changed. */
  dirty: boolean;
  /** Recompute value (computed) or re-run body (effect). */
  run?: () => void;
  /** Cleanup registered by the last effect run. */
  cleanup?: (() => void) | undefined;
  /** Owner that created this node (for disposal trees). */
  owner: Owner | null;
  /** Child nodes owned by this owner-like node (effects/roots). */
  children?: Set<ReactiveNode>;
}

/** Ownership scope — disposing a root disposes all owned nodes. */
export interface Owner {
  parent: Owner | null;
  nodes: Set<ReactiveNode>;
  disposed: boolean;
}

let activeNode: ReactiveNode | null = null;
let activeOwner: Owner | null = null;
let tracking = true;

export function getActiveNode(): ReactiveNode | null {
  return activeNode;
}

export function setActiveNode(node: ReactiveNode | null): ReactiveNode | null {
  const prev = activeNode;
  activeNode = node;
  return prev;
}

export function getActiveOwner(): Owner | null {
  return activeOwner;
}

export function setActiveOwner(owner: Owner | null): Owner | null {
  const prev = activeOwner;
  activeOwner = owner;
  return prev;
}

export function isTracking(): boolean {
  return tracking;
}

/** Run `fn` without collecting dependencies. */
export function untrack<T>(fn: () => T): T {
  const prev = tracking;
  tracking = false;
  try {
    return fn();
  } finally {
    tracking = prev;
  }
}

export function createOwner(parent: Owner | null = activeOwner): Owner {
  return {
    parent,
    nodes: new Set(),
    disposed: false,
  };
}

export function createNode(
  kind: NodeKind,
  name?: string,
  owner: Owner | null = activeOwner,
): ReactiveNode {
  const node: ReactiveNode = {
    kind,
    disposed: false,
    pending: false,
    sources: new Set(),
    observers: new Set(),
    dirty: true,
    owner,
  };
  if (name !== undefined) {
    node.name = name;
  }

  if (owner && !owner.disposed) {
    owner.nodes.add(node);
  }

  return node;
}

/** Register `source` as a dependency of the active consumer. */
export function track(source: ReactiveNode): void {
  if (!tracking || !activeNode || activeNode === source || source.disposed) {
    return;
  }
  source.observers.add(activeNode);
  activeNode.sources.add(source);
}

/** Drop all current source links for a node (before re-running). */
export function clearSources(node: ReactiveNode): void {
  for (const source of node.sources) {
    source.observers.delete(node);
  }
  node.sources.clear();
}

/** Notify observers that `source` changed. */
export function notify(source: ReactiveNode): void {
  for (const observer of source.observers) {
    if (observer.disposed) continue;

    if (observer.kind === "computed") {
      if (!observer.dirty) {
        observer.dirty = true;
        // Propagate dirty flags through computed chains.
        notify(observer);
      }
    } else if (observer.kind === "effect") {
      enqueue(observer);
    }
  }
}

/** Dispose a single node and unlink it from the graph. */
export function disposeNode(node: ReactiveNode): void {
  if (node.disposed) return;
  node.disposed = true;

  if (node.cleanup) {
    const c = node.cleanup;
    node.cleanup = undefined;
    c();
  }

  clearSources(node);

  for (const observer of node.observers) {
    observer.sources.delete(node);
  }
  node.observers.clear();

  if (node.children) {
    for (const child of node.children) {
      disposeNode(child);
    }
    node.children.clear();
  }

  if (node.owner) {
    node.owner.nodes.delete(node);
  }
}

/** Dispose an owner and every node it owns (depth-first). */
export function disposeOwner(owner: Owner): void {
  if (owner.disposed) return;
  owner.disposed = true;

  // Snapshot — disposal mutates the set.
  const nodes = [...owner.nodes];
  for (const node of nodes) {
    disposeNode(node);
  }
  owner.nodes.clear();
}

/**
 * Create a reactive root. All signals/effects created inside are owned by
 * this root and disposed when the returned dispose function is called.
 */
export function createRoot<T>(fn: (dispose: Dispose) => T): T {
  const owner = createOwner(activeOwner);
  const prevOwner = setActiveOwner(owner);

  const dispose: Dispose = () => {
    disposeOwner(owner);
  };

  try {
    return fn(dispose);
  } finally {
    setActiveOwner(prevOwner);
  }
}

/**
 * Run `fn` under a fresh owner nested under the current owner.
 * Useful for scoped components later.
 */
export function runWithOwner<T>(owner: Owner | null, fn: () => T): T {
  const prev = setActiveOwner(owner);
  try {
    return fn();
  } finally {
    setActiveOwner(prev);
  }
}
