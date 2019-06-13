import * as R from 'ramda'

import { setupStore, waitUntil } from '../../__helpers__'
import { pureChange } from '../../src/store/documents/actions'
import { commit, pureRedo, pureUndo } from '../../src/store/history/actions'
import {
  getHistory,
  getRedoStack,
  getUndoStack,
  hasPendingChanges
} from '../../src/store/history/reducer'
import {
  change,
  getDocument,
  initRoot,
  persist,
  redo,
  undo
} from '../../src/store'

let store: ReturnType<typeof setupStore>

beforeEach(() => {
  store = setupStore()
})

describe('History', () => {
  test('Initial state after initializing the root', async () => {
    store.dispatch(initRoot({ plugin: 'stateful', state: 0 }))
    await waitUntil(() =>
      R.any(action => action.type === persist.type, store.getActions())
    )
    const { initialState } = getHistory(store.getState())
    if (!initialState) throw new Error('Expected initial state')
    expect(initialState.documents).toEqual({
      root: {
        plugin: 'stateful',
        state: 0
      }
    })
    expect(hasPendingChanges(store.getState())).toEqual(false)
  })

  test('Changes will be committed to the history', async () => {
    store.dispatch(initRoot({ plugin: 'stateful', state: 0 }))
    await waitUntil(() =>
      R.any(action => action.type === persist.type, store.getActions())
    )
    store.dispatch(change({ id: 'root', state: () => 1 }))
    await waitUntil(() =>
      R.any(action => action.type === commit.type, store.getActions())
    )
    expect(hasPendingChanges(store.getState())).toEqual(true)
    const undoStack = getUndoStack(store.getState())
    expect(undoStack).toHaveLength(1)
    expect(undoStack[0]).toHaveLength(1)
    expect(undoStack[0][0].type).toEqual(pureChange.type)
  })

  test('Commits will be added to the redo stack after reverting', async () => {
    store.dispatch(initRoot({ plugin: 'stateful', state: 0 }))
    await waitUntil(() =>
      R.any(action => action.type === persist.type, store.getActions())
    )
    store.dispatch(change({ id: 'root', state: () => 1 }))
    await waitUntil(() =>
      R.any(action => action.type === commit.type, store.getActions())
    )
    store.dispatch(undo())
    expect(getUndoStack(store.getState())).toHaveLength(0)
    expect(getRedoStack(store.getState())).toHaveLength(1)
  })

  test('Redo stack will be purged after a commit', async () => {
    store.dispatch(initRoot({ plugin: 'stateful', state: 0 }))
    await waitUntil(() =>
      R.any(action => action.type === persist.type, store.getActions())
    )
    store.dispatch(change({ id: 'root', state: () => 1 }))
    await waitUntil(() =>
      R.any(action => action.type === commit.type, store.getActions())
    )
    store.dispatch(undo())
    await waitUntil(() =>
      R.any(action => action.type === pureUndo.type, store.getActions())
    )
    store.dispatch(change({ id: 'root', state: () => 2 }))
    expect(getUndoStack(store.getState())).toHaveLength(1)
    expect(getRedoStack(store.getState())).toHaveLength(0)
  })

  test('Undo reverts the last committed actions', async () => {
    store.dispatch(initRoot({ plugin: 'stateful', state: 0 }))
    await waitUntil(() =>
      R.any(action => action.type === persist.type, store.getActions())
    )
    store.dispatch(change({ id: 'root', state: () => 1 }))
    await waitUntil(() =>
      R.any(action => action.type === commit.type, store.getActions())
    )
    store.dispatch(change({ id: 'root', state: () => 2 }))
    await waitUntil(() =>
      R.any(action => action.type === commit.type, store.getActions())
    )
    store.dispatch(undo())
    await waitUntil(() =>
      R.any(action => action.type === pureUndo.type, store.getActions())
    )
    expect(getDocument(store.getState(), 'root')).toEqual({
      plugin: 'stateful',
      state: 1
    })
  })

  test('Redo replays the last reverted commit', async () => {
    store.dispatch(initRoot({ plugin: 'stateful', state: 0 }))
    await waitUntil(() =>
      R.any(action => action.type === persist.type, store.getActions())
    )
    store.dispatch(change({ id: 'root', state: () => 1 }))
    await waitUntil(() =>
      R.any(action => action.type === commit.type, store.getActions())
    )
    store.dispatch(change({ id: 'root', state: () => 2 }))
    await waitUntil(() =>
      R.any(action => action.type === commit.type, store.getActions())
    )
    store.dispatch(undo())
    await waitUntil(() =>
      R.any(action => action.type === pureUndo.type, store.getActions())
    )
    store.dispatch(redo())
    await waitUntil(() =>
      R.any(action => action.type === pureRedo.type, store.getActions())
    )
    expect(getDocument(store.getState(), 'root')).toEqual({
      plugin: 'stateful',
      state: 2
    })
  })

  test('Undo after redo', async () => {
    store.dispatch(initRoot({ plugin: 'stateful', state: 0 }))
    await waitUntil(() =>
      R.any(action => action.type === persist.type, store.getActions())
    )
    store.dispatch(change({ id: 'root', state: () => 1 }))
    await waitUntil(() =>
      R.any(action => action.type === commit.type, store.getActions())
    )
    store.dispatch(change({ id: 'root', state: () => 2 }))
    await waitUntil(() =>
      R.any(action => action.type === commit.type, store.getActions())
    )
    store.dispatch(undo())
    await waitUntil(() =>
      R.any(action => action.type === pureUndo.type, store.getActions())
    )
    store.dispatch(redo())
    await waitUntil(() =>
      R.any(action => action.type === pureRedo.type, store.getActions())
    )
    store.dispatch(undo())
    await waitUntil(() =>
      R.any(action => action.type === pureUndo.type, store.getActions())
    )
    expect(getDocument(store.getState(), 'root')).toEqual({
      plugin: 'stateful',
      state: 1
    })
  })
})
