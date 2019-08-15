import * as React from 'react'

import { EditorContext } from '.'
import { ScopeContext } from './editor-context'
import { actions, selectors, ActionCreator } from './store'
import { getScope } from './store/reducer'

export function useEditorFocus(scope?: string) {
  const store = useStore(scope)
  return {
    focusPrevious: () => store.dispatch(actions.focusPrevious()),
    focusNext: () => store.dispatch(actions.focusNext())
  }
}

export function useEditorHistory(scope?: string) {
  const store = useStore(scope)
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

export function useStore(scope?: string) {
  const scopeContextValue = React.useContext(ScopeContext)
  const scopeToUse = scope === undefined ? scopeContextValue.scope : scope

  const { store } = React.useContext(EditorContext)
  return React.useMemo(() => {
    return {
      dispatch: function<T, P>(actionCreator: ReturnType<ActionCreator<T, P>>) {
        return store.dispatch(actionCreator(scopeToUse))
      },
      getState: () => {
        return getScope(store.getState(), scopeToUse)
      },
      subscribe: (listener: () => void) => {
        return store.subscribe(listener)
      }
    }
  }, [scopeToUse, store])
}

export function useScopedStore() {
  const { scope } = React.useContext(ScopeContext)
  return useStore(scope)
}

export type EditorStore = ReturnType<typeof useStore>
