import {
  applyMiddleware,
  createStore as createReduxStore,
  DeepPartial,
  Store,
  StoreEnhancer
} from 'redux'
import createSagaMiddleware from 'redux-saga'

import { selectors } from '.'
import { Plugin } from '../plugin'
import { Action } from './actions'
import { reducer } from './reducer'
import { saga } from './saga'
import { EditorState } from './types'

export function createStore<K extends string, Ext, StateExt>({
  instances,
  createEnhancer
}: StoreOptions<K, Ext, StateExt>): {
  store: Store<EditorState, Action>
} {
  const sagaMiddleware = createSagaMiddleware()
  const defaultEnhancer = applyMiddleware(sagaMiddleware)
  const enhancer = createEnhancer(defaultEnhancer)

  const initialStates: DeepPartial<EditorState> = {}
  for (const scope in instances) {
    initialStates[scope] = {
      plugins: {
        defaultPlugin: instances[scope].defaultPlugin,
        plugins: instances[scope].plugins
      }
    }
  }

  const store = createReduxStore<EditorState, Action, {}, {}>(
    reducer,
    initialStates,
    enhancer
  )
  sagaMiddleware.run(saga)

  return { store }
}

export interface StoreOptions<K extends string, Ext, StateExt> {
  instances: Record<
    string,
    {
      plugins: Record<K, Plugin>
      defaultPlugin: K
    }
  >
  createEnhancer: (
    defaultEnhancer: StoreEnhancer
  ) => StoreEnhancer<Ext, StateExt>
}

export type ChangeListener = (payload: {
  changed: boolean
  getDocument: () => ReturnType<typeof selectors.serializeRootDocument>
}) => void
