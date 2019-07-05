import * as React from 'react'

import { actions, selectors } from './store'
import { EditorContext } from '.'
import { ScopeContext } from './editor-context'
import { ActionCreator } from './store/helpers'

export function useEditorFocus() {
  const store = useStore()
  return {
    focusPrevious: () => store.dispatch(actions.focusPrevious()),
    focusNext: () => store.dispatch(actions.focusNext())
  }
}

export function useEditorHistory() {
  const store = useStore()
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

export function useStore() {
  const { scope } = React.useContext(ScopeContext)
  const { store } = React.useContext(EditorContext)
  return React.useMemo(() => {
    return {
      dispatch: function<T, P>(actionCreator: ReturnType<ActionCreator<T, P>>) {
        return store.dispatch(actionCreator(scope))
      },
      getState: () => {
        return store.getState()[scope]
      }
    }
  }, [scope, store])
}

export type EditorStore = ReturnType<typeof useStore>
