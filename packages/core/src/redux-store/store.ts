import {
  applyMiddleware,
  createStore as createReduxStore,
  Middleware,
  Store
} from 'redux'
import { composeWithDevTools } from 'remote-redux-devtools'

import { Plugin } from '../plugin'
import { Action } from './actions'
import { rootReducer, State } from './reducer'

export function createStore<K extends string>({
  defaultPlugin,
  plugins
}: {
  plugins: Record<K, Plugin>
  defaultPlugin: K
}): {
  store: Store<State, Action>
} {
  const composeEnhancers = composeWithDevTools({ realtime: true })
  const enhancer = composeEnhancers(applyMiddleware(...getMiddleware()))
  const store = createReduxStore<State, Action, { dispatch: {} }, {}>(
    rootReducer,
    {
      plugins: {
        defaultPlugin,
        plugins
      }
    },
    enhancer
  )

  return { store }

  function getMiddleware(): Middleware[] {
    if (process.env.NODE_ENV !== 'production') {
      const createImmutableStateInvariantMiddleware = require('redux-immutable-state-invariant')
        .default

      return [createImmutableStateInvariantMiddleware()]
    }

    return []
  }
}
