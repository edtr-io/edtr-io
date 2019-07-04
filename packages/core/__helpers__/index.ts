import { plugins } from '../__fixtures__/plugins'
import {Action, createStore} from '../src/store'

export const TEST_SCOPE = 'test'
export function setupStore() {
  let actions: Action[] = []
  const store = createStore({
    instances: {
      [TEST_SCOPE]: {
        plugins,
        defaultPlugin: 'text'
      }
    },
    actions
  }).store

  return {
    dispatch: (f:(scope: string) => Action) => {
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

export function wait(time = 10): Promise<void> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, time)
  })
}
