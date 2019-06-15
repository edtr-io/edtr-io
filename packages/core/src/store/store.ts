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

export function createStore<K extends string>({
  defaultPlugin,
  plugins,
  actions
}: {
  plugins: Record<K, Plugin>
  defaultPlugin: K
  actions?: Action[]
}): {
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

    return middlewares
  }
}
