import * as R from 'ramda'

import { setupStore, waitUntil } from '../../__helpers__'
import { getClipboard, copy, initRoot, getRoot } from '../../src/store'
import { pureCopy } from '../../src/store/clipboard/actions'
import { pureChange, pureInsert } from '../../src/store/documents/actions'

let store: ReturnType<typeof setupStore>

beforeEach(() => {
  store = setupStore()
})

describe('Clipboard', () => {
  test('Initial state', () => {
    expect(getClipboard(store.getState())).toEqual([])
  })

  describe('Copy', () => {
    test('Stateful plugin', async () => {
      store.dispatch(initRoot({ plugin: 'stateful', state: 0 }))
      await waitUntil(() =>
        R.any(action => action.type === pureInsert.type, store.getActions())
      )
      store.dispatch(copy(getRoot(store.getState())))
      await waitUntil(() =>
        R.any(action => action.type === pureCopy.type, store.getActions())
      )
      expect(getClipboard(store.getState())).toEqual([
        {
          plugin: 'stateful',
          state: 0
        }
      ])
    })

    test('Nested plugin', async () => {
      store.dispatch(
        initRoot({
          plugin: 'nested',
          state: {
            child: { plugin: 'stateful', state: 0 }
          }
        })
      )
      await waitUntil(() =>
        R.any(action => action.type === pureInsert.type, store.getActions())
      )
      store.dispatch(copy(getRoot(store.getState())))
      await waitUntil(() =>
        R.any(action => action.type === pureCopy.type, store.getActions())
      )
      expect(getClipboard(store.getState())).toEqual([
        {
          plugin: 'nested',
          state: {
            child: { plugin: 'stateful', state: 0 }
          }
        }
      ])
    })

    test('Four copies', async () => {
      store.dispatch(initRoot({ plugin: 'stateful', state: 0 }))
      await waitUntil(() =>
        R.any(action => action.type === pureInsert.type, store.getActions())
      )
      const root = getRoot(store.getState())
      if (!root) throw new Error('No root document found')
      store.dispatch(copy(root))
      await waitUntil(() =>
        R.any(action => action.type === pureCopy.type, store.getActions())
      )
      expect(getClipboard(store.getState())).toHaveLength(1)
      expect(getClipboard(store.getState())[0]).toEqual({
        plugin: 'stateful',
        state: 0
      })
      store.dispatch(pureChange({ id: root, state: 1 }))
      store.dispatch(copy(root))
      await waitUntil(() =>
        R.any(action => action.type === pureCopy.type, store.getActions())
      )
      expect(getClipboard(store.getState())).toHaveLength(2)
      expect(getClipboard(store.getState())[0]).toEqual({
        plugin: 'stateful',
        state: 1
      })
      store.dispatch(pureChange({ id: root, state: 2 }))
      store.dispatch(copy(root))
      await waitUntil(() =>
        R.any(action => action.type === pureCopy.type, store.getActions())
      )
      expect(getClipboard(store.getState())).toHaveLength(3)
      expect(getClipboard(store.getState())[0]).toEqual({
        plugin: 'stateful',
        state: 2
      })
      store.dispatch(pureChange({ id: root, state: 3 }))
      store.dispatch(copy(root))
      await waitUntil(() =>
        R.any(action => action.type === pureCopy.type, store.getActions())
      )
      expect(getClipboard(store.getState())).toHaveLength(3)
      expect(getClipboard(store.getState())[0]).toEqual({
        plugin: 'stateful',
        state: 3
      })
    })
  })
})
