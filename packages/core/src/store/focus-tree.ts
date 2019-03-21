import { isStatefulPlugin } from '../plugin'
import { getDocument, getPlugin, getRoot, State } from './reducer'

export function getFocusTree(state: State): Node | null {
  const root = getRoot(state)

  if (!root) {
    return null
  }

  return getTree(root)

  function getTree(id: string) {
    const document = getDocument(state, id)

    if (!document) {
      return null
    }

    const plugin = getPlugin(state, document.plugin)

    if (!plugin) {
      return null
    }

    let children
    if (
      isStatefulPlugin(plugin) &&
      typeof plugin.getFocusableChildren === 'function'
    ) {
      const pluginState = plugin.state(document.state, () => {})
      children = plugin.getFocusableChildren(pluginState)
    }

    return {
      id,
      children
    }
  }
}

export function findNextNode(root: Node, from: string): string | null {
  const parent = findParent(root, from)

  if (!parent || parent.id === from) {
    return null
  }

  const { children } = parent

  if (!children) {
    return null
  }

  const index = children.findIndex(child => child.id === from)

  // Has sibling
  if (index + 1 < children.length) {
    // Go deep
    let current = children[index + 1]
    while (current.children && current.children.length > 0) {
      current = current.children[0]
    }
    return current.id
  }

  // No siblings. Need to find next node of parent
  return findNextNode(root, parent.id)
}

export function findPreviousNode(root: Node, from: string): string | null {
  const parent = findParent(root, from)

  if (!parent || parent.id === from) {
    return null
  }

  const { children } = parent

  if (!children) {
    return null
  }

  const index = children.findIndex(child => child.id === from)

  // Has sibling
  if (index >= 1) {
    // Go deep
    let current = children[index - 1]
    while (current.children && current.children.length > 0) {
      current = current.children[current.children.length - 1]
    }
    return current.id
  }

  // No siblings. Need to find previous node of parent
  return findPreviousNode(root, parent.id)
}

export function findParent(root: Node, id: string): Node | null {
  if (root.id === id) {
    return root
  }

  const children = root.children || []
  for (let i = 0; i < children.length; i++) {
    const resolved = findParent(children[i], id)

    if (resolved) {
      if (resolved.id === id) {
        return root
      }
      return resolved
    }
  }

  return null
}

export interface ResolvedIdentifier {
  parent: string
  index?: number
}

export interface Node {
  id: string
  children?: Node[]
}
