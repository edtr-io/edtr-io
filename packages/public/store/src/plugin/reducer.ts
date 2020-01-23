import { getDocument } from '../documents'
import { findParent, getFocusTree } from '../focus'
import { createSelector } from '../helpers'
import { getPlugin } from '../plugins'
import { Selector } from '../types'

/** @public */
export const mayInsertChild: Selector<boolean, [string]> = createSelector(
  (state, sibling: string) => {
    const root = getFocusTree()(state)
    if (!root) return false
    const parent = findParent(root, sibling)
    if (!parent) return false
    const parentDocument = getDocument(parent.id)(state)
    if (!parentDocument) return false
    const type = parentDocument.plugin
    const plugin = getPlugin(type)(state)
    if (!plugin) return false
    return typeof plugin.insertChild === 'function'
  }
)
/** @public */
export const mayRemoveChild: Selector<boolean, [string]> = createSelector(
  (state, sibling: string) => {
    const root = getFocusTree()(state)
    if (!root) return false
    const parent = findParent(root, sibling)
    if (!parent) return false
    const parentDocument = getDocument(parent.id)(state)
    if (!parentDocument) return false
    const type = parentDocument.plugin
    const plugin = getPlugin(type)(state)
    if (!plugin) return false
    return typeof plugin.removeChild === 'function'
  }
)
