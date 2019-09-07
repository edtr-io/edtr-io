import { plugins } from '@edtr-io/fixtures'
import * as R from 'ramda'

import { setupStore, waitUntil } from '../__helpers__'
import * as S from '../src'
import { pureCopy } from '../src/clipboard/actions'
import { pureChange, pureInsert } from '../src/documents/actions'

let store: ReturnType<typeof setupStore>

beforeEach(() => {
  store = setupStore()
})

describe('Clipboard', () => {
  test('Initial state', () => {
    expect(S.getClipboard()(store.getState())).toEqual([])
  })

  describe('Copy', () => {
    test('Stateful plugin', async () => {
      store.dispatch(
        S.initRoot({
          initialState: { plugin: 'stateful', state: 0 },
          plugins,
          defaultPlugin: 'text'
        })
      )
      await waitUntil(() =>
        R.any(action => action.type === pureInsert.type, store.getActions())
      )
      store.dispatch(S.copy(S.getRoot()(store.getState())))
      await waitUntil(() =>
        R.any(action => action.type === pureCopy.type, store.getActions())
      )
      expect(S.getClipboard()(store.getState())).toEqual([
        {
          plugin: 'stateful',
          state: 0
        }
      ])
    })

    test('Nested plugin', async () => {
      store.dispatch(
        S.initRoot({
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
      store.dispatch(S.copy(S.getRoot()(store.getState())))
      await waitUntil(() =>
        R.any(action => action.type === pureCopy.type, store.getActions())
      )
      expect(S.getClipboard()(store.getState())).toEqual([
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
        S.initRoot({
          initialState: { plugin: 'stateful', state: 0 },
          plugins,
          defaultPlugin: 'text'
        })
      )
      await waitUntil(() =>
        R.any(action => action.type === pureInsert.type, store.getActions())
      )
      const root = S.getRoot()(store.getState())
      if (!root) throw new Error('No root document found')
      store.dispatch(S.copy(root))
      await waitUntil(() =>
        R.any(action => action.type === pureCopy.type, store.getActions())
      )
      expect(S.getClipboard()(store.getState())).toHaveLength(1)
      expect(S.getClipboard()(store.getState())[0]).toEqual({
        plugin: 'stateful',
        state: 0
      })
      store.dispatch(pureChange({ id: root, state: 1 }))
      store.dispatch(S.copy(root))
      await waitUntil(() =>
        R.any(action => action.type === pureCopy.type, store.getActions())
      )
      expect(S.getClipboard()(store.getState())).toHaveLength(2)
      expect(S.getClipboard()(store.getState())[0]).toEqual({
        plugin: 'stateful',
        state: 1
      })
      store.dispatch(pureChange({ id: root, state: 2 }))
      store.dispatch(S.copy(root))
      await waitUntil(() =>
        R.any(action => action.type === pureCopy.type, store.getActions())
      )
      expect(S.getClipboard()(store.getState())).toHaveLength(3)
      expect(S.getClipboard()(store.getState())[0]).toEqual({
        plugin: 'stateful',
        state: 2
      })
      store.dispatch(pureChange({ id: root, state: 3 }))
      store.dispatch(S.copy(root))
      await waitUntil(() =>
        R.any(action => action.type === pureCopy.type, store.getActions())
      )
      expect(S.getClipboard()(store.getState())).toHaveLength(3)
      expect(S.getClipboard()(store.getState())[0]).toEqual({
        plugin: 'stateful',
        state: 3
      })
    })
  })
})
