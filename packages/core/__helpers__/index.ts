import * as R from 'ramda'
import { plugins } from '../__fixtures__/plugins'
import {Action, actions, createStore} from '../src/store'
import { actions as actionCreators } from "../src/store"

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
    ...store,
    getState: () => store.getState()[TEST_SCOPE],
    getActions() {
      return actions
    },
    resetActions() {
      actions = []
    }
  }
}

export function scopeActions() : { [ K in keyof typeof actionCreators]: ReturnType<typeof actionCreators[K]> } {
  return R.map(action => action(TEST_SCOPE), actionCreators)
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
