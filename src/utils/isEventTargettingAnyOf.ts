/**
 * Check if the event target node, or any of the target's parent nodes
 * are amongst the specified elements.
 */
export function isEventTargetingAnyOf(
  event: Event | undefined | null,
  ...elements: Array<Node | undefined | null>
): boolean {
  const nonEmptyElements = new Set(elements.filter((el) => !!el));

  if (!event || nonEmptyElements.size === 0) {
    return false;
  }

  let node: Node = event.target as HTMLElement;
  while (node && node.parentNode) {
    if (nonEmptyElements.has(node)) {
      return true;
    }
    node = node.parentNode;
  }

  return false;
}
