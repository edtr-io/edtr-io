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
import { EditorState } from './types'
import { selectors } from './index'

export function createStore<K extends string>({
  instances,
  actions
}: StoreOptions<K>): {
  store: Store<EditorState, Action>
} {
  const sagaMiddleware = createSagaMiddleware()
  const composeEnhancers = composeWithDevTools({ realtime: true })
  const enhancer = composeEnhancers(applyMiddleware(...getMiddleware()))

  const initialStates: DeepPartial<EditorState> = {}
  for (let scope in instances) {
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

export interface StoreOptions<K extends string> {
  instances: Record<
    string,
    {
      plugins: Record<K, Plugin>
      defaultPlugin: K
    }
  >
  actions?: Action[]
}

export type ChangeListener = (payload: {
  changed: boolean
  getDocument: () => ReturnType<typeof selectors.serializeRootDocument>
}) => void
