import { createSubReducer } from '../helpers'
import { State } from '../types'
import {
  focus,
  FocusDocumentAction,
  focusNext,
  FocusNextDocumentAction,
  focusPrevious
} from './actions'

import { getDocument } from '../documents'
import { getPlugin } from '../plugins'
import { getRoot } from '../root'
import { isStatefulPlugin } from '../../plugin'

export const focusReducer = createSubReducer('focus', null, {
  [focus.type](_focusState, action: FocusDocumentAction) {
    return action.payload
  },
  [focusNext.type](focusState, _action: FocusNextDocumentAction, state) {
    return handleFocus(focusState, state, findNextNode)
  },
  [focusPrevious.type](focusState, _action: FocusNextDocumentAction, state) {
    return handleFocus(focusState, state, findPreviousNode)
  }
})

function handleFocus(
  focusState: State['focus'],
  state: State | undefined,
  findNode: typeof findNextNode
) {
  if (!state) return focusState
  const from = focusState
  if (!from) return focusState
  const root = getFocusTree(state)
  if (!root) return focusState
  const next = findNode(root, from)
  if (!next) return focusState
  return next
}

export function getFocused(state: State) {
  return state.focus
}

export function isFocused(state: State, id: string) {
  return getFocused(state) === id
}

export function getFocusTree(state: State, root = getRoot(state)): Node | null {
  if (!root) return null
  const document = getDocument(state, root)
  if (!document) return null
  const plugin = getPlugin(state, document.plugin)
  if (!plugin) return null

  let children
  if (
    isStatefulPlugin(plugin) &&
    typeof plugin.getFocusableChildren === 'function'
  ) {
    const pluginState = plugin.state(document.state, () => {})
    children = plugin.getFocusableChildren(pluginState).map(child => {
      const subtree = getFocusTree(state, child.id)
      return subtree || child
    })
  }

  return {
    id: root,
    children
  }
}

export function findNextNode(root: Node, from: string): string | null {
  const parent = findParent(root, from)
  if (!parent || parent.id === from) return null
  const { children } = parent
  if (!children) return null

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
  if (!parent || parent.id === from) return null
  const { children } = parent
  if (!children) return null

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

export interface Node {
  id: string
  children?: Node[]
}
