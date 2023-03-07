import * as R from 'ramda'

import {
  pureInsert,
  PureInsertAction,
  pureReplaceText,
  PureReplaceTextAction,
} from '../documents/actions'
import { getDocument } from '../documents/reducer'
import {
  createDeepEqualSelector,
  createJsonStringifySelector,
  createSelector,
  createSubReducer,
  SubReducer,
} from '../helpers'
import { getPlugin } from '../plugins/reducer'
import { getRoot } from '../root/reducer'
import { ScopedState, Selector } from '../types'
import {
  blur,
  BlurAction,
  focus,
  FocusDocumentAction,
  focusNext,
  FocusNextDocumentAction,
  focusPrevious,
} from './actions'

/** @internal */
export const focusReducer: SubReducer<string | null> = createSubReducer(
  'focus',
  null,
  {
    [blur.type](_focusState, _action: BlurAction) {
      return null
    },
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
    },
    [pureReplaceText.type](_focusState, action: PureReplaceTextAction, _state) {
      return action.payload.newId
    },
  }
)

/**
 * [[Selector]] that returns the id of the focused element (if there is any)
 *
 * @returns id of the focused element (`null` if there is no focused element)
 * @public
 */
export const getFocused: Selector<string | null, []> = createSelector(
  (state) => state.focus
)

/**
 * [[Selector]] that checks whether the document with the given id is focused
 *
 * @param id - id of the document to check
 * @returns `true` if the given document is focused
 * @public
 */
export const isFocused: Selector<boolean, [string]> = createSelector(
  (state, id: string) => getFocused()(state) === id
)

/**
 * [[Selector]] that returns the focus tree from the root document with the given id
 *
 * @param id - optional id of the document that should be considered as the root of the focus tree. By default, we use the root document of the current scope
 * @returns the [[focus tree|Node]] if it exists (`null` otherwise)
 * @public
 */
export const getFocusTree: Selector<Node | null, [string?]> =
  createJsonStringifySelector((state, id = undefined) => {
    const root = id ? id : getRoot()(state)
    if (!root) return null
    const document = getDocument(root)(state)
    if (!document) return null
    const plugin = getPlugin(document.plugin)(state)
    if (!plugin) return null

    const children = plugin.state
      .getFocusableChildren(document.state)
      .map((child) => {
        const subtree = getFocusTree(child.id)(state)
        return subtree || child
      })

    return {
      id: root,
      children,
    }
  })

/** @public */
export const getParent: Selector<Node | null, [string]> = createSelector(
  (state, id) => {
    const root = getFocusTree()(state)
    return root && findParent(root, id)
  }
)

/**
 * [[Selector]] that returns the focus path from the leaf with the given id
 *
 * @param defaultLeaf - optional id of the document that should be considered as the leaf of the focus path. By default, we use the currently focused document of the current scope
 * @returns an array of ids of the documents that are part of the focus path (i.e. the focused document and their ancestors). `null`, if there exists no focus path
 * @public
 */
export const getFocusPath: Selector<string[] | null, [string?]> =
  createDeepEqualSelector((state, defaultLeaf = undefined) => {
    const leaf = defaultLeaf ? defaultLeaf : getFocused()(state)
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
  })

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
 * @public
 */
export const hasFocusedChild: Selector<boolean, [string]> = createSelector(
  (state, id: string) => {
    const tree = getFocusTree(id)(state)
    if (!tree || !tree.children) return false
    const focused = getFocused()(state)
    return R.any((node) => node.id === focused, tree.children)
  }
)

/**
 * [[Selector]] that checks whether the document with the given id has a focused descendant. In contrast to [[hasFocusedChild]], this also returns `true` if the focused document is an indirect child (e.g. a child of a child of a child).
 *
 * @param id - id of the document to check
 * @returns `true` if the given document has a focused descendant
 * @public
 */
export const hasFocusedDescendant: Selector<boolean, [string]> = createSelector(
  (state, id: string): boolean => {
    const tree = getFocusTree(id)(state)
    if (!tree || !tree.children) return false
    return R.any(
      (node) =>
        isFocused(node.id)(state) || hasFocusedDescendant(node.id)(state),
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
 * @public
 */
export function findNextNode(root: Node, from: string): string | null {
  const parent = findParent(root, from)
  if (!parent || parent.id === from) return null
  const { children } = parent
  if (!children) return null

  const index = children.findIndex((child) => child.id === from)

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
 * @public
 */
export function findPreviousNode(root: Node, from: string): string | null {
  const parent = findParent(root, from)
  if (!parent || parent.id === from) return null
  const { children } = parent
  if (!children) return null

  const index = children.findIndex((child) => child.id === from)
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
 * Finds the parent node of an id in the focus tree
 *
 * @param root - focus tree
 * @param id - id of the current node
 * @returns the `Node` of the parent, if the id exists in the focus tree. (`null` otherwise)
 * @public
 */
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

/** @public */
export interface Node {
  id: string
  children?: Node[]
}
