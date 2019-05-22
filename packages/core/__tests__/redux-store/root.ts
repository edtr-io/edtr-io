import * as R from 'ramda'

import { setupStore, waitUntil } from '../../__helpers__'
import { getRoot, initRoot, serializeRootDocument } from '../../src/redux-store'
import { pureInsert } from '../../src/redux-store/documents/actions'

let store: ReturnType<typeof setupStore>

beforeEach(() => {
  store = setupStore()
})

describe('Root', () => {
  test('Initial state', () => {
    expect(getRoot(store.getState())).toEqual(null)
  })

  describe('Init Root', () => {
    test('Stateless Plugin', async () => {
      store.dispatch(initRoot({ plugin: 'stateless' }))
      await waitUntil(() =>
        R.any(action => action.type === pureInsert.type, store.getActions())
      )
      expect(serializeRootDocument(store.getState())).toEqual({
        plugin: 'stateless'
      })
    })

    test('Stateful Plugin', async () => {
      store.dispatch(initRoot({ plugin: 'stateful', state: 0 }))
      await waitUntil(() =>
        R.any(action => action.type === pureInsert.type, store.getActions())
      )
      expect(serializeRootDocument(store.getState())).toEqual({
        plugin: 'stateful',
        state: 0
      })
    })

    test('Nested', async () => {
      store.dispatch(
        initRoot({
          plugin: 'nested',
          state: {
            child: { plugin: 'stateful', state: 0 }
          }
        })
      )
      await waitUntil(
        () =>
          R.filter(
            action => action.type === pureInsert.type,
            store.getActions()
          ).length === 2
      )
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

    test('Nested Array', async () => {
      store.dispatch(
        initRoot({
          plugin: 'nestedArray',
          state: {
            children: [{ plugin: 'stateful', state: 1 }]
          }
        })
      )
      await waitUntil(
        () =>
          R.filter(
            action => action.type === pureInsert.type,
            store.getActions()
          ).length === 2
      )
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

    test('Nested Inside Nested', async () => {
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
      await waitUntil(
        () =>
          R.filter(
            action => action.type === pureInsert.type,
            store.getActions()
          ).length === 4
      )
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
