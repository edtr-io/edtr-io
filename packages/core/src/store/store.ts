import {
  applyMiddleware,
  createStore as createReduxStore,
  Middleware,
  Store
} from 'redux'
import createSagaMiddleware from 'redux-saga'
import { composeWithDevTools } from 'remote-redux-devtools'

import { Plugin } from '../plugin'
import { Action } from './actions'
import { reducer } from './reducer'
import { saga } from './saga'
import { State } from './types'
import { selectors } from '@edtr-io/core'

export function createStore<K extends string>({
  onChange,
  defaultPlugin,
  plugins,
  actions
}: StoreOptions<K>): {
  store: Store<State, Action>
} {
  const sagaMiddleware = createSagaMiddleware()
  const composeEnhancers = composeWithDevTools({ realtime: true })
  const enhancer = composeEnhancers(applyMiddleware(...getMiddleware()))
  const initialState = {
    plugins: {
      defaultPlugin,
      plugins
    }
  }
  const store = createReduxStore<State, Action, {}, {}>(
    reducer,
    initialState,
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

    if (typeof onChange === 'function') {
      middlewares.push(createChangeMiddleware(onChange))
    }

    return middlewares
  }

  function createChangeMiddleware(onChange: ChangeListener): Middleware {
    let pendingChanges = 0

    return store => next => action => {
      const result = next(action)
      const currentPendingChanges = selectors.getPendingChanges(
        store.getState()
      )
      if (currentPendingChanges !== pendingChanges) {
        onChange({
          changed: selectors.hasPendingChanges(store.getState()),
          document: selectors.serializeRootDocument(store.getState())
        })
        pendingChanges = currentPendingChanges
      }
      return result
    }
  }
}

export interface StoreOptions<K extends string> {
  onChange?: ChangeListener
  plugins: Record<K, Plugin>
  defaultPlugin: K
  actions?: Action[]
}

type ChangeListener = ({
  changed,
  document
}: {
  changed: boolean
  document: ReturnType<typeof selectors.serializeRootDocument>
}) => void
