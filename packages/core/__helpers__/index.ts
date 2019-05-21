import { Action, createStore } from '../src/redux-store'
import { plugins } from '../__fixtures__/plugins'

export function setupStore() {
  let actions: Action[] = []
  const store = createStore({
    plugins,
    defaultPlugin: 'text',
    actions
  }).store

  return {
    ...store,
    getActions() {
      return actions
    },
    resetActions() {
      actions = []
    }
  }
}

export function waitUntil(check: () => boolean): Promise<void> {
  return new Promise(resolve => {
    if (check()) {
      resolve()
    }

    return wait().then(() => waitUntil(check))
  })
}

function wait(): Promise<void> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, 10)
  })
}
