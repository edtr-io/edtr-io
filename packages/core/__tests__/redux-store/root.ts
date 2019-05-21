import { setupStore, waitUntil } from '../../__helpers__'
import { getRoot, initRoot, serializeRootDocument } from '../../src/redux-store'

let store: ReturnType<typeof setupStore>

beforeEach(() => {
  store = setupStore()
})

describe('Root', () => {
  test('Initial state', () => {
    expect(getRoot(store.getState())).toEqual(null)
  })

  describe('Init Root', () => {
    test('Stateless Plugin', () => {
      store.dispatch(initRoot({ plugin: 'stateless' }))

      return waitUntil(() => store.getActions().length >= 2).then(() => {
        expect(serializeRootDocument(store.getState())).toEqual({
          plugin: 'stateless'
        })
      })
    })

    test('Stateful Plugin', () => {
      store.dispatch(initRoot({ plugin: 'stateful', state: 0 }))

      return waitUntil(() => store.getActions().length >= 2).then(() => {
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

      return waitUntil(() => store.getActions().length >= 3).then(() => {
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

      return waitUntil(() => store.getActions().length >= 3).then(() => {
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

      return waitUntil(() => store.getActions().length >= 5).then(() => {
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
