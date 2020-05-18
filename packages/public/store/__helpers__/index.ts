import { plugins } from '@edtr-io/internal__fixtures'
import { applyMiddleware, compose, Middleware } from 'redux'

import { createStore, InternalAction } from '../src'
import { InternalStore } from '../src/types'

export const TEST_SCOPE = 'test'
export function setupStore() {
  let actions: InternalAction[] = []
  const testMiddleware: Middleware = () => (next) => (action) => {
    actions.push(action)
    return next(action)
  }

  const store = createStore({
    scopes: {
      [TEST_SCOPE]: plugins,
    },
    createEnhancer: (defaultEnhancer) => {
      return compose(defaultEnhancer, applyMiddleware(testMiddleware))
    },
  }).store as InternalStore

  return {
    dispatch: (f: (scope: string) => InternalAction) => {
      const action = f(TEST_SCOPE)
      store.dispatch(action)
      return action
    },
    getState: () => store.getState()[TEST_SCOPE],
    getActions() {
      return actions
    },
    resetActions() {
      actions = []
    },
  }
}

export function waitUntil(check: () => boolean): Promise<void> {
  return new Promise((resolve) => {
    if (check()) {
      resolve()
    }

    resolve(wait().then(() => waitUntil(check)))
  })
}

export function wait(time = 10): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, time)
  })
}
