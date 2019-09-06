import { plugins } from '@edtr-io/fixtures'
import * as R from 'ramda'

import { setupStore, wait, waitUntil } from '../__helpers__'
import * as S from '../src'
import { pureChange } from '../src/documents/actions'
import {
  commit,
  persist,
  pureRedo,
  pureReset,
  pureUndo
} from '../src/history/actions'
import { getHistory, getRedoStack, getUndoStack } from '../src/history/reducer'

let store: ReturnType<typeof setupStore>

beforeEach(() => {
  store = setupStore()
})

describe('History', () => {
  beforeEach(async () => {
    store.dispatch(
      S.initRoot({
        initialState: { plugin: 'stateful', state: 0 },
        plugins,
        defaultPlugin: 'text'
      })
    )
    await waitUntil(() =>
      R.any(action => action.type === persist.type, store.getActions())
    )
  })

  test('Initial state after initializing the root', () => {
    const { initialState } = getHistory(store.getState())
    if (!initialState) throw new Error('Expected initial state')
    expect(initialState.documents).toEqual({
      root: {
        plugin: 'stateful',
        state: 0
      }
    })
    expect(S.hasPendingChanges(store.getState())).toEqual(false)
  })

  test('Changes will be committed to the history', async () => {
    await change({ id: 'root', state: () => 1 })
    expect(S.hasPendingChanges(store.getState())).toEqual(true)
    const undoStack = getUndoStack(store.getState())
    expect(undoStack).toHaveLength(1)
    expect(undoStack[0]).toHaveLength(1)
    expect(undoStack[0][0].type).toEqual(pureChange.type)
  })

  test('Commits will be added to the redo stack after reverting', async () => {
    await change({ id: 'root', state: () => 1 })
    await undo()
    expect(getUndoStack(store.getState())).toHaveLength(0)
    expect(getRedoStack(store.getState())).toHaveLength(1)
  })

  test('Redo stack will be purged after a commit', async () => {
    await change({ id: 'root', state: () => 1 })
    await undo()
    store.dispatch(S.change({ id: 'root', state: () => 2 }))
    expect(getUndoStack(store.getState())).toHaveLength(1)
    expect(getRedoStack(store.getState())).toHaveLength(0)
  })

  test('Undo reverts the last committed actions', async () => {
    await change({ id: 'root', state: () => 1 })
    await wait(1000)
    await change({ id: 'root', state: () => 2 })
    await undo()
    expect(S.getDocument(store.getState(), 'root')).toEqual({
      plugin: 'stateful',
      state: 1
    })
  })

  test('Redo replays the last reverted commit', async () => {
    await change({ id: 'root', state: () => 1 })
    await change({ id: 'root', state: () => 2 })
    await undo()
    await redo()
    expect(S.getDocument(store.getState(), 'root')).toEqual({
      plugin: 'stateful',
      state: 2
    })
  })

  test('Undo keeps order of previous commits', async () => {
    await change({ id: 'root', state: () => 1 })
    await wait(1000)
    await change({ id: 'root', state: () => 2 })
    await wait(1000)
    await change({ id: 'root', state: () => 3 })
    await undo()
    expect(S.getDocument(store.getState(), 'root')).toEqual({
      plugin: 'stateful',
      state: 2
    })
    await undo()
    expect(S.getDocument(store.getState(), 'root')).toEqual({
      plugin: 'stateful',
      state: 1
    })
  })

  test('Redo keeps order of remaining commits', async () => {
    await change({ id: 'root', state: () => 1 })
    await wait(1000)
    await change({ id: 'root', state: () => 2 })
    await wait(1000)
    await change({ id: 'root', state: () => 3 })
    await undo()
    await undo()
    await undo()
    await redo()
    expect(S.getDocument(store.getState(), 'root')).toEqual({
      plugin: 'stateful',
      state: 1
    })
    await redo()
    expect(S.getDocument(store.getState(), 'root')).toEqual({
      plugin: 'stateful',
      state: 2
    })
  })

  test('Undo keeps order of actions in previous commits', async () => {
    await change({ id: 'root', state: () => 1 })
    await change({ id: 'root', state: () => 2 })
    await wait(1000)
    await change({ id: 'root', state: () => 3 })
    await undo()
    expect(S.getDocument(store.getState(), 'root')).toEqual({
      plugin: 'stateful',
      state: 2
    })
  })

  test('Redo keeps order of actions in remaining commits', async () => {
    await change({ id: 'root', state: () => 1 })
    await wait(1000)
    await change({ id: 'root', state: () => 2 })
    await change({ id: 'root', state: () => 3 })
    await undo()
    await undo()
    await redo()
    await redo()
    expect(S.getDocument(store.getState(), 'root')).toEqual({
      plugin: 'stateful',
      state: 3
    })
  })

  test('Changes in a small time frame will be combined into a single commit', async () => {
    await change({ id: 'root', state: () => 1 })
    await change({ id: 'root', state: () => 2 })
    expect(getUndoStack(store.getState())).toHaveLength(1)
  })

  test('Changes in a longer time frame will not be combined', async () => {
    await change({ id: 'root', state: () => 1 })
    await wait(1000)
    await change({ id: 'root', state: () => 2 })
    expect(getUndoStack(store.getState())).toHaveLength(2)
  })

  test('Undo after redo', async () => {
    await change({ id: 'root', state: () => 1 })
    await wait(1000)
    await change({ id: 'root', state: () => 2 })
    await undo()
    await redo()
    await undo()
    expect(S.getDocument(store.getState(), 'root')).toEqual({
      plugin: 'stateful',
      state: 1
    })
  })

  test('Reset after one change', async () => {
    await change({ id: 'root', state: () => 1 })
    await reset()
    expect(S.getDocument(store.getState(), 'root')).toEqual({
      plugin: 'stateful',
      state: 0
    })
  })

  test('Reset after two changes', async () => {
    await change({ id: 'root', state: () => 1 })
    await change({ id: 'root', state: () => 2 })
    // undoStack: [[1, 2]]
    await reset()
    expect(S.getDocument(store.getState(), 'root')).toEqual({
      plugin: 'stateful',
      state: 0
    })
  })

  test('Reset after persist and undo', async () => {
    await change({ id: 'root', state: () => 1 })
    await change({ id: 'root', state: () => 2 })
    store.dispatch(S.persist())
    await undo()
    await reset()
    expect(S.getDocument(store.getState(), 'root')).toEqual({
      plugin: 'stateful',
      state: 2
    })
  })
})

async function undo() {
  store.dispatch(S.undo())
  await waitUntil(() =>
    R.any(action => action.type === pureUndo.type, store.getActions())
  )
}

async function redo() {
  store.dispatch(S.redo())
  await waitUntil(() =>
    R.any(action => action.type === pureRedo.type, store.getActions())
  )
}

async function change(...args: Parameters<typeof S.change>) {
  store.dispatch(S.change(...args))
  await waitUntil(() =>
    R.any(action => action.type === commit.type, store.getActions())
  )
}

async function reset() {
  store.dispatch(S.reset())
  await waitUntil(() =>
    R.any(action => action.type === pureReset.type, store.getActions())
  )
}
