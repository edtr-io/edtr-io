import {
  applyMiddleware,
  createStore as createReduxStore,
  DeepPartial,
  Middleware,
  Store
} from 'redux'
import createSagaMiddleware from 'redux-saga'
import { composeWithDevTools } from 'remote-redux-devtools'

import { Plugin } from '../plugin'
import { Action } from './actions'
import { reducer } from './reducer'
import { saga } from './saga'
import { StoreState } from './types'
import { selectors } from './index'

export function createStore<K extends string>({
  instances,
  actions
}: StoreOptions<K>): {
  store: Store<StoreState, Action>
} {
  const sagaMiddleware = createSagaMiddleware()
  const composeEnhancers = composeWithDevTools({ realtime: true })
  const enhancer = composeEnhancers(applyMiddleware(...getMiddleware()))

  const initialStates: DeepPartial<StoreState> = {}
  for (let scope in instances) {
    initialStates[scope] = {
      plugins: {
        defaultPlugin: instances[scope].defaultPlugin,
        plugins: instances[scope].plugins
      }
    }
  }

  const store = createReduxStore<StoreState, Action, {}, {}>(
    reducer,
    initialStates,
    enhancer
  )
  sagaMiddleware.run(saga)

  return { store }

  function getMiddleware(): Middleware[] {
    const middlewares: Middleware[] = [sagaMiddleware]

    if (process.env.NODE_ENV !== 'production') {
      const createImmutableStateInvariantMiddleware = require('redux-immutable-state-invariant')
        .default

      middlewares.push(createImmutableStateInvariantMiddleware())
    }

    if (process.env.NODE_ENV === 'test') {
      const testMiddleware: Middleware = () => next => action => {
        if (actions) {
          actions.push(action)
        }
        return next(action)
      }
      middlewares.push(testMiddleware)
    }

    for (let scope in instances) {
      const { onChange } = instances[scope]
      if (typeof onChange === 'function') {
        middlewares.push(createChangeMiddleware(scope, onChange))
      }
    }

    return middlewares
  }

  function createChangeMiddleware(
    scope: string,
    onChange: ChangeListener
  ): Middleware<{}, StoreState> {
    let pendingChanges = 0

    return store => next => action => {
      const result = next(action)
      const currentPendingChanges = selectors.getPendingChanges(
        store.getState()[scope]
      )
      if (currentPendingChanges !== pendingChanges) {
        onChange({
          changed: selectors.hasPendingChanges(store.getState()[scope]),
          document: selectors.serializeRootDocument(store.getState()[scope])
        })
        pendingChanges = currentPendingChanges
      }
      return result
    }
  }
}

export interface StoreOptions<K extends string> {
  instances: Record<
    string,
    {
      onChange?: ChangeListener
      plugins: Record<K, Plugin>
      defaultPlugin: K
    }
  >
  actions?: Action[]
}

type ChangeListener = ({
  changed,
  document
}: {
  changed: boolean
  document: ReturnType<typeof selectors.serializeRootDocument>
}) => void
