import * as R from 'ramda'

import {
  scopeActions,
  setupStore,
  TEST_SCOPE,
  waitUntil
} from '../../__helpers__'
import { pureCopy } from '../../src/store/clipboard/actions'
import { pureChange, pureInsert } from '../../src/store/documents/actions'
import { selectors } from '../../src/store'

let store: ReturnType<typeof setupStore>
const scopedActions = scopeActions()

beforeEach(() => {
  store = setupStore()
})

describe('Clipboard', () => {
  test('Initial state', () => {
    expect(selectors.getClipboard(store.getState())).toEqual([])
  })

  describe('Copy', () => {
    test('Stateful plugin', async () => {
      store.dispatch(scopedActions.initRoot({ plugin: 'stateful', state: 0 }))
      await waitUntil(() =>
        R.any(action => action.type === pureInsert.type, store.getActions())
      )
      store.dispatch(scopedActions.copy(selectors.getRoot(store.getState())))
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
        scopedActions.initRoot({
          plugin: 'nested',
          state: {
            child: { plugin: 'stateful', state: 0 }
          }
        })
      )
      await waitUntil(() =>
        R.any(action => action.type === pureInsert.type, store.getActions())
      )
      store.dispatch(scopedActions.copy(selectors.getRoot(store.getState())))
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
      store.dispatch(scopedActions.initRoot({ plugin: 'stateful', state: 0 }))
      await waitUntil(() =>
        R.any(action => action.type === pureInsert.type, store.getActions())
      )
      const root = selectors.getRoot(store.getState())
      if (!root) throw new Error('No root document found')
      store.dispatch(scopedActions.copy(root))
      await waitUntil(() =>
        R.any(action => action.type === pureCopy.type, store.getActions())
      )
      expect(selectors.getClipboard(store.getState())).toHaveLength(1)
      expect(selectors.getClipboard(store.getState())[0]).toEqual({
        plugin: 'stateful',
        state: 0
      })
      store.dispatch(pureChange(TEST_SCOPE)({ id: root, state: 1 }))
      store.dispatch(scopedActions.copy(root))
      await waitUntil(() =>
        R.any(action => action.type === pureCopy.type, store.getActions())
      )
      expect(selectors.getClipboard(store.getState())).toHaveLength(2)
      expect(selectors.getClipboard(store.getState())[0]).toEqual({
        plugin: 'stateful',
        state: 1
      })
      store.dispatch(pureChange(TEST_SCOPE)({ id: root, state: 2 }))
      store.dispatch(scopedActions.copy(root))
      await waitUntil(() =>
        R.any(action => action.type === pureCopy.type, store.getActions())
      )
      expect(selectors.getClipboard(store.getState())).toHaveLength(3)
      expect(selectors.getClipboard(store.getState())[0]).toEqual({
        plugin: 'stateful',
        state: 2
      })
      store.dispatch(pureChange(TEST_SCOPE)({ id: root, state: 3 }))
      store.dispatch(scopedActions.copy(root))
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
