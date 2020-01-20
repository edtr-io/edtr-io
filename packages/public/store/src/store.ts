import { EditorPlugin } from '@edtr-io/internal__plugin'
import {
  applyMiddleware,
  createStore as createReduxStore,
  Store,
  StoreEnhancer,
  PreloadedState
} from 'redux'
import createSagaMiddleware from 'redux-saga'

import { Action } from './actions'
import { reducer } from './reducer'
import { serializeRootDocument } from './root/reducer'
import { saga } from './saga'
import { ReturnTypeFromSelector, State } from './types'

/**
 * Creates the Edtr.io store
 *
 * @returns The Edtr.io store
 * @public
 */
export function createStore<K extends string>({
  instances,
  createEnhancer
}: StoreOptions<K>): {
  store: Store<State, Action>
} {
  const sagaMiddleware = createSagaMiddleware()
  const defaultEnhancer = applyMiddleware(sagaMiddleware)
  const enhancer = createEnhancer(defaultEnhancer)

  const initialStates: PreloadedState<State> = {}
  for (const scope in instances) {
    initialStates[scope] = {
      plugins: {
        defaultPlugin: instances[scope].defaultPlugin,
        plugins: instances[scope].plugins
      },
      documents: {},
      focus: null,
      root: null,
      clipboard: [],
      history: {
        undoStack: [],
        redoStack: [],
        pendingChanges: 0
      }
    }
  }

  const store = createReduxStore<State, Action, {}, {}>(
    reducer,
    initialStates,
    enhancer
  )
  sagaMiddleware.run(saga)

  return { store }
}

/** @public */
export interface StoreOptions<K extends string> {
  instances: Record<
    string,
    {
      plugins: Record<K, EditorPlugin>
      defaultPlugin: K
    }
  >
  createEnhancer: StoreEnhancerFactory
}

/** @public */
export type StoreEnhancerFactory = (
  defaultEnhancer: StoreEnhancer
) => StoreEnhancer<{}, {}>

/** @public */
export type ChangeListener = (payload: {
  changed: boolean
  getDocument: () => ReturnTypeFromSelector<typeof serializeRootDocument>
}) => void
