import * as React from 'react'

import { focusNext, focusPrevious } from './store/focus'
import { persist, reset, redo, undo } from './store/history'
import { setEditable } from './store/mode'
import { EditorContext, hasPendingChanges, isEditable } from '.'

export function useEditorFocus() {
  const { store } = React.useContext(EditorContext)
  return {
    focusPrevious: () => store.dispatch(focusPrevious()),
    focusNext: () => store.dispatch(focusNext())
  }
}

export function useEditorHistory() {
  const { store } = React.useContext(EditorContext)
  return {
    hasPendingChanges: hasPendingChanges(store.getState()),
    undo: () => store.dispatch(undo()),
    redo: () => store.dispatch(redo()),
    persist: () => {
      store.dispatch(persist())
    },
    reset: () => {
      store.dispatch(reset())
    }
  }
}

export function useEditorMode(): [boolean, (payload: boolean) => void] {
  const { store } = React.useContext(EditorContext)
  const editable = isEditable(store.getState())
  return [editable, dispatchSetEditable]

  function dispatchSetEditable(payload: boolean) {
    store.dispatch(setEditable(payload))
  }
}
