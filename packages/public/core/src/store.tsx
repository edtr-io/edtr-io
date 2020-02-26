import { getScope, Action, State, ScopedState, Store } from '@edtr-io/store'
import * as React from 'react'
import {
  Provider as ReduxProvider,
  ProviderProps,
  ReactReduxContextValue
} from 'react-redux'

const createDispatchHook: (
  context: React.Context<ReactReduxContextValue<State>>
) => // eslint-disable-next-line import/no-commonjs
() => (action: Action) => void = require('react-redux').createDispatchHook
const createSelectorHook: (
  context: React.Context<ReactReduxContextValue<State>>
) => // eslint-disable-next-line import/no-commonjs
<T>(selector: (state: State) => T) => T = require('react-redux')
  .createSelectorHook
const createStoreHook: (
  context: React.Context<ReactReduxContextValue<State>>
) => // eslint-disable-next-line import/no-commonjs
() => Store = require('react-redux').createStoreHook

/** @public */
export const ScopeContext = React.createContext<{
  scope: string
  editable?: boolean
}>({ scope: '' })

/** @public */
export const EditorContext = React.createContext<ReactReduxContextValue<State>>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  undefined as any
)

/** @public */
export const ErrorContext = React.createContext<
  ((error: Error, errorInfo: { componentStack: string }) => void) | undefined
>(undefined)

// eslint-disable-next-line jsdoc/require-returns
/**
 * Store Provider
 *
 * @param props - The {@link https://react-redux.js.org/api/provider#props | ProviderProps}
 * @public
 */
export function Provider(
  props: ProviderProps<Action> & { children: React.ReactNode }
) {
  return <ReduxProvider {...props} context={EditorContext} />
}

/**
 * @param enforcedScope - If provided, used as the scope instead of the current scope
 *
 * @public
 */
export function useScope(enforcedScope?: string) {
  const { scope } = React.useContext(ScopeContext)
  return enforcedScope === undefined ? scope : enforcedScope
}

/** @public */
export const useDispatch = createDispatchHook(EditorContext)

// eslint-disable-next-line jsdoc/require-returns
/**
 * React Hook to dispatch an action in the current scope
 *
 * @param enforcedScope - If provided, used as the scope instead of the current scope
 * @public
 */
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

/** @public */
export const useSelector = createSelectorHook(EditorContext)
/**
 * React Hook to get the value of an selector in the current scope
 *
 * @param scopedSelector - The selector
 * @param enforcedScope - If provided, used as the scope instead of the current scope
 * @returns The value of the selector in the current scope
 * @public
 */
export function useScopedSelector<T>(
  scopedSelector: (state: ScopedState) => T,
  enforcedScope?: string
) {
  const scope = useScope(enforcedScope)
  return useSelector(state => scopedSelector(getScope(state, scope)))
}

/** @public */
export const useStore = createStoreHook(EditorContext)
/**
 * React Hook to obtain a reference to the scoped store
 *
 * @param enforcedScope - If provided, used as the scope instead of the current scope
 * @returns The scoped store
 * @public
 */
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
