import { EditorPlugin } from '@edtr-io/internal__plugin'
import * as R from 'ramda'
import {
  applyMiddleware,
  createStore as createReduxStore,
  PreloadedState,
  Store,
  StoreEnhancer,
} from 'redux'
import _createSagaMiddleware from 'redux-saga'

import { Action, InternalAction } from './actions'
import { reducer } from './reducer'
import { serializeRootDocument } from './root/reducer'
import { saga } from './saga'
import { InternalState, SelectorReturnType, State } from './types'

const createSagaMiddleware = _createSagaMiddleware

/**
 * Creates the Edtr.io store
 *
 * @param options - The options
 * @returns The Edtr.io store
 * @public
 */
export function createStore<K extends string>(
  options: StoreOptions<K>
): {
  store: Store<State, Action>
} {
  const { scopes, createEnhancer } = options
  const sagaMiddleware = createSagaMiddleware()
  const defaultEnhancer = applyMiddleware(sagaMiddleware)
  const enhancer = createEnhancer(defaultEnhancer)

  const initialStates = R.mapObjIndexed((scope) => {
    return {
      plugins: scope,
      documents: {},
      focus: null,
      root: null,
      clipboard: [],
      history: {
        undoStack: [],
        redoStack: [],
        pendingChanges: 0,
      },
    }
  }, scopes)

  // eslint-disable-next-line @typescript-eslint/ban-types
  const store = createReduxStore<InternalState, InternalAction, {}, {}>(
    reducer,
    // Redux does something weird with `unknown` values.
    initialStates as unknown as PreloadedState<InternalState>,
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
) => StoreEnhancer

/** @public */
export type ChangeListener = (payload: {
  changed: boolean
  getDocument: () => SelectorReturnType<typeof serializeRootDocument>
}) => void
