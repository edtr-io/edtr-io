/**
 * @module @edtr-io/store
 */
/** Comment needed because of https://github.com/christopherthielen/typedoc-plugin-external-module-name/issues/337 */
import { Plugin } from '@edtr-io/internal__plugin'
import {
  applyMiddleware,
  createStore as createReduxStore,
  DeepPartial,
  Store,
  StoreEnhancer
} from 'redux'
import createSagaMiddleware from 'redux-saga'

import { Action } from './actions'
import { reducer } from './reducer'
import { serializeRootDocument } from './root/reducer'
import { saga } from './saga'
import { ReturnTypeFromSelector, State } from './types'

export function createStore<K extends string>({
  instances,
  createEnhancer
}: StoreOptions<K>): {
  store: Store<State, Action>
} {
  const sagaMiddleware = createSagaMiddleware()
  const defaultEnhancer = applyMiddleware(sagaMiddleware)
  const enhancer = createEnhancer(defaultEnhancer)

  const initialStates: DeepPartial<State> = {}
  for (const scope in instances) {
    initialStates[scope] = {
      plugins: {
        defaultPlugin: instances[scope].defaultPlugin,
        plugins: instances[scope].plugins
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

export interface StoreOptions<K extends string> {
  instances: Record<
    string,
    {
      plugins: Record<K, Plugin>
      defaultPlugin: K
    }
  >
  createEnhancer: StoreEnhancerFactory
}

export type StoreEnhancerFactory = (
  defaultEnhancer: StoreEnhancer
) => StoreEnhancer<{}, {}>

export type ChangeListener = (payload: {
  changed: boolean
  getDocument: () => ReturnTypeFromSelector<typeof serializeRootDocument>
}) => void
