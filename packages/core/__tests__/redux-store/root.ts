import { plugins } from '../../__fixtures__/plugins'
import {
  Action,
  createStore,
  getDocument,
  getRoot,
  initRoot
} from '../../src/redux-store'

let actions: Action[]
let store: ReturnType<typeof createStore>['store']

beforeEach(() => {
  actions = []
  store = createStore({
    plugins,
    defaultPlugin: 'text',
    actions
  }).store
})

function waitUntil(check: () => boolean): Promise<void> {
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

describe('Root', () => {
  test('Initial state', () => {
    expect(getRoot(store.getState())).toEqual(null)
  })

  test('Init Root', () => {
    store.dispatch(initRoot({ plugin: 'stateful', state: 0 }))
    const root = getRoot(store.getState())

    if (!root) {
      throw new Error('No root document found')
    }

    return waitUntil(() => actions.length >= 2).then(() => {
      expect(getDocument(store.getState(), root)).toEqual({
        plugin: 'stateful',
        state: 0
      })
    })
  })
})
