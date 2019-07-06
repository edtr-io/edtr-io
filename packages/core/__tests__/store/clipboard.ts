import * as R from 'ramda'

import { plugins } from '../../__fixtures__/plugins'
import { setupStore, waitUntil } from '../../__helpers__'
import { pureCopy } from '../../src/store/clipboard/actions'
import { pureChange, pureInsert } from '../../src/store/documents/actions'
import { actions, selectors } from '../../src'

let store: ReturnType<typeof setupStore>

beforeEach(() => {
  store = setupStore()
})

describe('Clipboard', () => {
  test('Initial state', () => {
    expect(selectors.getClipboard(store.getState())).toEqual([])
  })

  describe('Copy', () => {
    test('Stateful plugin', async () => {
      store.dispatch(
        actions.initRoot({
          initialState: { plugin: 'stateful', state: 0 },
          plugins,
          defaultPlugin: 'text'
        })
      )
      await waitUntil(() =>
        R.any(action => action.type === pureInsert.type, store.getActions())
      )
      store.dispatch(actions.copy(selectors.getRoot(store.getState())))
      await waitUntil(() =>
        R.any(action => action.type === pureCopy.type, store.getActions())
      )
      expect(selectors.getClipboard(store.getState())).toEqual([
        {
          plugin: 'stateful',
          state: 0
        }
      ])
    })

    test('Nested plugin', async () => {
      store.dispatch(
        actions.initRoot({
          initialState: {
            plugin: 'nested',
            state: {
              child: { plugin: 'stateful', state: 0 }
            }
          },
          plugins,
          defaultPlugin: 'text'
        })
      )
      await waitUntil(() =>
        R.any(action => action.type === pureInsert.type, store.getActions())
      )
      store.dispatch(actions.copy(selectors.getRoot(store.getState())))
      await waitUntil(() =>
        R.any(action => action.type === pureCopy.type, store.getActions())
      )
      expect(selectors.getClipboard(store.getState())).toEqual([
        {
          plugin: 'nested',
          state: {
            child: { plugin: 'stateful', state: 0 }
          }
        }
      ])
    })

    test('Four copies', async () => {
      store.dispatch(
        actions.initRoot({
          initialState: { plugin: 'stateful', state: 0 },
          plugins,
          defaultPlugin: 'text'
        })
      )
      await waitUntil(() =>
        R.any(action => action.type === pureInsert.type, store.getActions())
      )
      const root = selectors.getRoot(store.getState())
      if (!root) throw new Error('No root document found')
      store.dispatch(actions.copy(root))
      await waitUntil(() =>
        R.any(action => action.type === pureCopy.type, store.getActions())
      )
      expect(selectors.getClipboard(store.getState())).toHaveLength(1)
      expect(selectors.getClipboard(store.getState())[0]).toEqual({
        plugin: 'stateful',
        state: 0
      })
      store.dispatch(pureChange({ id: root, state: 1 }))
      store.dispatch(actions.copy(root))
      await waitUntil(() =>
        R.any(action => action.type === pureCopy.type, store.getActions())
      )
      expect(selectors.getClipboard(store.getState())).toHaveLength(2)
      expect(selectors.getClipboard(store.getState())[0]).toEqual({
        plugin: 'stateful',
        state: 1
      })
      store.dispatch(pureChange({ id: root, state: 2 }))
      store.dispatch(actions.copy(root))
      await waitUntil(() =>
        R.any(action => action.type === pureCopy.type, store.getActions())
      )
      expect(selectors.getClipboard(store.getState())).toHaveLength(3)
      expect(selectors.getClipboard(store.getState())[0]).toEqual({
        plugin: 'stateful',
        state: 2
      })
      store.dispatch(pureChange({ id: root, state: 3 }))
      store.dispatch(actions.copy(root))
      await waitUntil(() =>
        R.any(action => action.type === pureCopy.type, store.getActions())
      )
      expect(selectors.getClipboard(store.getState())).toHaveLength(3)
      expect(selectors.getClipboard(store.getState())[0]).toEqual({
        plugin: 'stateful',
        state: 3
      })
    })
  })
})
