import { plugins } from '../../__fixtures__/plugins'
import {
  Action,
  createStore,
  getRoot,
  initRoot,
  serializeRootDocument
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

  describe('Init Root', () => {
    test('Stateless Plugin', () => {
      store.dispatch(initRoot({ plugin: 'stateless' }))

      return waitUntil(() => actions.length >= 2).then(() => {
        expect(serializeRootDocument(store.getState())).toEqual({
          plugin: 'stateless'
        })
      })
    })

    test('Stateful Plugin', () => {
      store.dispatch(initRoot({ plugin: 'stateful', state: 0 }))

      return waitUntil(() => actions.length >= 2).then(() => {
        expect(serializeRootDocument(store.getState())).toEqual({
          plugin: 'stateful',
          state: 0
        })
      })
    })

    test('Nested', () => {
      store.dispatch(
        initRoot({
          plugin: 'nested',
          state: {
            child: { plugin: 'stateful', state: 0 }
          }
        })
      )

      return waitUntil(() => actions.length >= 3).then(() => {
        expect(serializeRootDocument(store.getState())).toEqual({
          plugin: 'nested',
          state: {
            child: {
              plugin: 'stateful',
              state: 0
            }
          }
        })
      })
    })

    test('Nested Array', () => {
      store.dispatch(
        initRoot({
          plugin: 'nestedArray',
          state: {
            children: [{ plugin: 'stateful', state: 1 }]
          }
        })
      )

      return waitUntil(() => actions.length >= 3).then(() => {
        expect(serializeRootDocument(store.getState())).toEqual({
          plugin: 'nestedArray',
          state: {
            children: [
              {
                plugin: 'stateful',
                state: 1
              }
            ]
          }
        })
      })
    })

    test('Nested Inside Nested', () => {
      store.dispatch(
        initRoot({
          plugin: 'nestedArray',
          state: {
            children: [
              { plugin: 'stateful', state: 1 },
              {
                plugin: 'nested',
                state: {
                  child: {
                    plugin: 'stateful',
                    state: 2
                  }
                }
              }
            ]
          }
        })
      )

      return waitUntil(() => actions.length >= 5).then(() => {
        expect(serializeRootDocument(store.getState())).toEqual({
          plugin: 'nestedArray',
          state: {
            children: [
              {
                plugin: 'stateful',
                state: 1
              },
              {
                plugin: 'nested',
                state: {
                  child: { plugin: 'stateful', state: 2 }
                }
              }
            ]
          }
        })
      })
    })
  })
})
