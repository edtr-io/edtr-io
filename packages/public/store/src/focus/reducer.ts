/**
 * @module @edtr-io/store
 */
/** Comment needed because of https://github.com/christopherthielen/typedoc-plugin-external-module-name/issues/337 */
import * as R from 'ramda'

import { pureInsert, PureInsertAction } from '../documents/actions'
import { getDocument } from '../documents/reducer'
import { createSelector, createSubReducer } from '../helpers'
import { getPlugin } from '../plugins/reducer'
import { getRoot } from '../root/reducer'
import { ScopedState, Selector } from '../types'
import {
  focus,
  FocusDocumentAction,
  focusNext,
  FocusNextDocumentAction,
  focusPrevious
} from './actions'

/**
 * @ignore
 **/
export const focusReducer = createSubReducer('focus', null, {
  [focus.type](_focusState, action: FocusDocumentAction) {
    return action.payload
  },
  [focusNext.type](focusState, _action: FocusNextDocumentAction, state) {
    return handleFocus(focusState, state, findNextNode)
  },
  [focusPrevious.type](focusState, _action: FocusNextDocumentAction, state) {
    return handleFocus(focusState, state, findPreviousNode)
  },
  [pureInsert.type](_focusState, action: PureInsertAction, _state) {
    return action.payload.id
  }
})

/**
 * [[Selector]] that returns the id of the focused element (if there is any)
 *
 * @returns id of the focused element (`null` if there is no focused element)
 */
export const getFocused: Selector<string | null, []> = createSelector(
  state => state.focus
)

/**
 * [[Selector]] that checks whether the document with the given id is focused
 *
 * @param id - id of the document to check
 * @returns `true` if the given document is focused
 */
export const isFocused: Selector<boolean, [string]> = createSelector(
  (state, id: string) => getFocused()(state) === id
)

/**
 * [[Selector]] that returns the focus tree from the root document with the given id
 *
 * @param id - optional id of the document that should be considered as the root of the focus tree. By default, we use the root document of the current scope
 * @returns the [[focus tree|Node]] if it exists (`null` otherwise)
 */
export const getFocusTree: Selector<Node | null, [string?]> = createSelector(
  (state: ScopedState, root: string | null = getRoot()(state)): Node | null => {
    if (!root) return null
    const document = getDocument(root)(state)
    if (!document) return null
    const plugin = getPlugin(document.plugin)(state)
    if (!plugin) return null

    const children = plugin.state
      .getFocusableChildren(document.state)
      .map(child => {
        const subtree = getFocusTree(child.id)(state)
        return subtree || child
      })

    return {
      id: root,
      children
    }
  }
)

/**
 * [[Selector]] that returns the focus path from the leaf with the given id
 *
 * @param id - optional id of the document that should be considered as the leaf of the focus path. By default, we use the currently focused document of the current scope
 * @returns an array of ids of the documents that are part of the focus path (i.e. the focused document and their ancestors). `null`, if there exists no focus path
 */
export const getFocusPath: Selector<
  string[] | null,
  [string?]
> = createSelector(
  (
    state: ScopedState,
    leaf: string | null = getFocused()(state)
  ): string[] | null => {
    if (!leaf) return null
    const root = getFocusTree()(state)
    if (!root) return null

    let current = leaf
    let path: string[] = [leaf]

    while (current !== root.id) {
      const parent = findParent(root, current)
      if (!parent) return null
      current = parent.id
      path = [current, ...path]
    }

    return path
  }
)

function handleFocus(
  focusState: ScopedState['focus'],
  state: ScopedState,
  findNode: typeof findNextNode
) {
  const from = focusState
  if (!from) return focusState
  const root = getFocusTree()(state)
  if (!root) return focusState
  const next = findNode(root, from)
  if (!next) return focusState
  return next
}

/**
 * [[Selector]] that checks whether the document with the given id has a focused child. In contrast to [[hasFocusedDescendant]], this only returns `true` if the focused document is a direct child of the document.
 *
 * @param id - id of the document to check
 * @returns `true` if the given document has a focused child
 */
export const hasFocusedChild: Selector<boolean, [string]> = createSelector(
  (state, id: string) => {
    const tree = getFocusTree(id)(state)
    if (!tree || !tree.children) return false
    const focused = getFocused()(state)
    return R.any(node => node.id === focused, tree.children)
  }
)

/**
 * [[Selector]] that checks whether the document with the given id has a focused descendant. In contrast to [[hasFocusedChild]], this also returns `true` if the focused document is an indirect child (e.g. a child of a child of a child).
 *
 * @param id - id of the document to check
 * @returns `true` if the given document has a focused descendant
 */
export const hasFocusedDescendant: Selector<boolean, [string]> = createSelector(
  (state, id: string): boolean => {
    const tree = getFocusTree(id)(state)
    if (!tree || !tree.children) return false
    return R.any(
      node => isFocused(node.id)(state) || hasFocusedDescendant(node.id)(state),
      tree.children
    )
  }
)

/**
 * Finds the next node in a focus tree in focus order
 *
 * @param root - focus tree
 * @param from - id of the current document
 * @returns the id of the next document if it exists (`null` otherwise)
 */
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

/**
 * Finds the previous node in a focus tree in focus order
 *
 * @param root - focus tree
 * @param from - id of the current document
 * @returns the id of the previous document if it exists (`null` otherwise)
 */
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

/**
 * @ignore
 * @private
 **/
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

/**
 * @ignore
 * @private
 **/
export interface Node {
  id: string
  children?: Node[]
}
