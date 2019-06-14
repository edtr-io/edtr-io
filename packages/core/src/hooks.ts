import * as React from 'react'

import { actions, selectors } from './store'
import { EditorContext } from '.'

export function useEditorFocus() {
  const { store } = React.useContext(EditorContext)
  return {
    focusPrevious: () => store.dispatch(actions.focusPrevious()),
    focusNext: () => store.dispatch(actions.focusNext())
  }
}

export function useEditorHistory() {
  const { store } = React.useContext(EditorContext)
  return {
    hasPendingChanges: selectors.hasPendingChanges(store.getState()),
    undo: () => store.dispatch(actions.undo()),
    redo: () => store.dispatch(actions.redo()),
    persist: () => {
      store.dispatch(actions.persist())
    },
    reset: () => {
      store.dispatch(actions.reset())
    }
  }
}

export function useEditorMode(): [boolean, (payload: boolean) => void] {
  const { store } = React.useContext(EditorContext)
  const editable = selectors.isEditable(store.getState())
  return [editable, dispatchSetEditable]

  function dispatchSetEditable(payload: boolean) {
    store.dispatch(actions.setEditable(payload))
  }
}
