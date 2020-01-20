import { useScopedStore } from '@edtr-io/core'
import { findParent, getFocusPath, getFocusTree, Node } from '@edtr-io/store'
import * as R from 'ramda'

export function useCanDrop(id: string, draggingAbove: boolean) {
  const store = useScopedStore()

  return function(dragId?: string) {
    return (
      dragId &&
      !wouldDropInOwnChildren(dragId) &&
      !wouldDropAtInitialPosition(dragId)
    )
  }

  function wouldDropInOwnChildren(dragId: string) {
    const focusPath = getFocusPath(id)(store.getState()) || []
    return focusPath.includes(dragId)
  }

  function wouldDropAtInitialPosition(dragId: string) {
    const focusTree = getFocusTree()(store.getState())
    if (!focusTree) return true
    const parent = findParent(focusTree, dragId)

    const dropIndex = getChildPosition(parent, id)
    // Different parents, so definitely not dropped at initial position
    if (dropIndex === null) return false
    const dragIndex = getChildPosition(parent, dragId)

    return draggingAbove
      ? dragIndex === dropIndex - 1
      : dragIndex === dropIndex + 1
  }

  function getChildPosition(
    parent: Node | null,
    childId: string
  ): number | null {
    if (!parent) return null
    const position = R.findIndex(
      node => node.id === childId,
      parent.children || []
    )
    return position > -1 ? position : null
  }
}
