import * as React from 'react'

import { ActionType, EditorContext, hasPendingChanges, isEditable } from '.'

export function useEditorFocus() {
  const store = React.useContext(EditorContext)
  return {
    focusPrevious: () =>
      store.dispatch({
        type: ActionType.FocusPrevious
      }),
    focusNext: () =>
      store.dispatch({
        type: ActionType.FocusNext
      })
  }
}

export function useEditorHistory() {
  const store = React.useContext(EditorContext)
  return {
    hasPendingChanges: hasPendingChanges(store.state),
    undo: () =>
      store.dispatch({
        type: ActionType.Undo
      }),
    redo: () =>
      store.dispatch({
        type: ActionType.Redo
      }),
    persist: () => {
      store.dispatch({
        type: ActionType.Persist
      })
    },
    reset: () => {
      store.dispatch({
        type: ActionType.Reset
      })
    }
  }
}

export function useEditorMode(): [boolean, (payload: boolean) => void] {
  const store = React.useContext(EditorContext)
  const editable = isEditable(store.state)
  return [editable, setEditable]

  function setEditable(payload: boolean) {
    store.dispatch({ type: ActionType.SwitchEditable, payload })
  }
}
