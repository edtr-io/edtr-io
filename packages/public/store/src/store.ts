import { EditorPlugin } from '@edtr-io/internal__plugin'
import * as R from 'ramda'
import {
  applyMiddleware,
  createStore as createReduxStore,
  Store,
  StoreEnhancer
} from 'redux'
import createSagaMiddleware from 'redux-saga'

import { Action, InternalAction } from './actions'
import { reducer } from './reducer'
import { serializeRootDocument } from './root/reducer'
import { saga } from './saga'
import { InternalState, SelectorReturnType, State } from './types'

/**
 * Creates the Edtr.io store
 *
 * @returns The Edtr.io store
 * @public
 */
export function createStore<K extends string>({
  scopes,
  createEnhancer
}: StoreOptions<K>): {
  store: Store<State, Action>
} {
  const sagaMiddleware = createSagaMiddleware()
  const defaultEnhancer = applyMiddleware(sagaMiddleware)
  const enhancer = createEnhancer(defaultEnhancer)

  const initialStates = R.mapObjIndexed(scope => {
    return {
      plugins: scope,
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
  }, scopes)

  const store = createReduxStore<InternalState, InternalAction, {}, {}>(
    reducer,
    initialStates,
    enhancer
  ) as Store<State, Action>
  sagaMiddleware.run(saga)

  return { store }
}

/** @public */
export interface StoreOptions<K extends string> {
  scopes: Record<string, Record<K, EditorPlugin>>
  createEnhancer: StoreEnhancerFactory
}

/** @public */
export type StoreEnhancerFactory = (
  defaultEnhancer: StoreEnhancer
) => StoreEnhancer<{}, {}>

/** @public */
export type ChangeListener = (payload: {
  changed: boolean
  getDocument: () => SelectorReturnType<typeof serializeRootDocument>
}) => void
