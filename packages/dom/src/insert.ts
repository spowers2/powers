/** Append or insert a node. Returns the node for chaining. */
export function insert<T extends Node>(
  parent: ParentNode,
  child: T,
  anchor: Node | null = null,
): T {
  parent.insertBefore(child, anchor);
  return child;
}

/** Remove a node from its parent if attached. */
export function remove(node: Node): void {
  node.parentNode?.removeChild(node);
}
