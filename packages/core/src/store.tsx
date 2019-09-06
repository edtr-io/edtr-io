import { getScope, Action, State, ScopedState, Store } from '@edtr-io/store'
import * as React from 'react'
import {
  Provider as ReduxProvider,
  ProviderProps,
  ReactReduxContextValue
} from 'react-redux'

const createDispatchHook: (
  context: React.Context<ReactReduxContextValue<State>>
) => () => (action: Action) => void = require('react-redux').createDispatchHook
const createSelectorHook: (
  context: React.Context<ReactReduxContextValue<State>>
) => <T>(selector: (state: State) => T) => T = require('react-redux')
  .createSelectorHook
const createStoreHook: (
  context: React.Context<ReactReduxContextValue<State>>
) => () => Store = require('react-redux').createStoreHook

export const ScopeContext = React.createContext<{
  scope: string
  editable?: boolean
}>({ scope: '' })

export const EditorContext = React.createContext<ReactReduxContextValue<State>>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  undefined as any
)

export const ErrorContext = React.createContext<
  ((error: Error, errorInfo: { componentStack: string }) => void) | undefined
>(undefined)

export function Provider(
  props: ProviderProps<Action> & { children: React.ReactNode }
) {
  return <ReduxProvider {...props} context={EditorContext} />
}

export function useScope(enforcedScope?: string) {
  const { scope } = React.useContext(ScopeContext)
  return enforcedScope === undefined ? scope : enforcedScope
}

export const useDispatch = createDispatchHook(EditorContext)
export function useScopedDispatch(enforcedScope?: string) {
  const scope = useScope(enforcedScope)
  const dispatch = useDispatch()
  return React.useCallback(scopeDispatch(dispatch, scope), [dispatch, scope])
}

function scopeDispatch(dispatch: (action: Action) => void, scope: string) {
  return (scopedAction: (scope: string) => Action) => {
    dispatch(scopedAction(scope))
  }
}

export const useSelector = createSelectorHook(EditorContext)
export function useScopedSelector<T>(
  scopedSelector: (state: ScopedState) => T,
  enforcedScope?: string
) {
  const scope = useScope(enforcedScope)
  return useSelector(state => scopedSelector(getScope(state, scope)))
}

export const useStore = createStoreHook(EditorContext)
export function useScopedStore(enforcedScope?: string) {
  const scope = useScope(enforcedScope)
  const store = useStore()
  return React.useMemo(() => {
    return {
      dispatch: scopeDispatch(store.dispatch, scope),
      getState: () => {
        return getScope(store.getState(), scope)
      },
      subscribe: (listener: () => void) => {
        return store.subscribe(listener)
      }
    }
  }, [scope, store])
}
