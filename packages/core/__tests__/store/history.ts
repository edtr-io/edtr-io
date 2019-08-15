import * as R from 'ramda'

import { plugins } from '../../__fixtures__/plugins'
import { setupStore, wait, waitUntil } from '../../__helpers__'
import { actions, selectors } from '../../src'
import { pureChange } from '../../src/store/documents/actions'
import {
  commit,
  persist,
  pureRedo,
  pureReset,
  pureUndo
} from '../../src/store/history/actions'
import {
  getHistory,
  getRedoStack,
  getUndoStack
} from '../../src/store/history/reducer'

let store: ReturnType<typeof setupStore>

beforeEach(() => {
  store = setupStore()
})

describe('History', () => {
  beforeEach(async () => {
    store.dispatch(
      actions.initRoot({
        initialState: { plugin: 'stateful', state: 0 },
        plugins,
        defaultPlugin: 'text'
      })
    )
    await waitUntil(() =>
      R.any(action => action.type === persist.type, store.getActions())
    )
  })

  test('Initial state after initializing the root', async () => {
    const { initialState } = getHistory(store.getState())
    if (!initialState) throw new Error('Expected initial state')
    expect(initialState.documents).toEqual({
      root: {
        plugin: 'stateful',
        state: 0
      }
    })
    expect(selectors.hasPendingChanges(store.getState())).toEqual(false)
  })

  test('Changes will be committed to the history', async () => {
    await change({ id: 'root', state: () => 1 })
    expect(selectors.hasPendingChanges(store.getState())).toEqual(true)
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
    store.dispatch(actions.change({ id: 'root', state: () => 2 }))
    expect(getUndoStack(store.getState())).toHaveLength(1)
    expect(getRedoStack(store.getState())).toHaveLength(0)
  })

  test('Undo reverts the last committed actions', async () => {
    await change({ id: 'root', state: () => 1 })
    await wait(1000)
    await change({ id: 'root', state: () => 2 })
    await undo()
    expect(selectors.getDocument(store.getState(), 'root')).toEqual({
      plugin: 'stateful',
      state: 1
    })
  })

  test('Redo replays the last reverted commit', async () => {
    await change({ id: 'root', state: () => 1 })
    await change({ id: 'root', state: () => 2 })
    await undo()
    await redo()
    expect(selectors.getDocument(store.getState(), 'root')).toEqual({
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
    expect(selectors.getDocument(store.getState(), 'root')).toEqual({
      plugin: 'stateful',
      state: 2
    })
    await undo()
    expect(selectors.getDocument(store.getState(), 'root')).toEqual({
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
    expect(selectors.getDocument(store.getState(), 'root')).toEqual({
      plugin: 'stateful',
      state: 1
    })
    await redo()
    expect(selectors.getDocument(store.getState(), 'root')).toEqual({
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
    expect(selectors.getDocument(store.getState(), 'root')).toEqual({
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
    expect(selectors.getDocument(store.getState(), 'root')).toEqual({
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
    expect(selectors.getDocument(store.getState(), 'root')).toEqual({
      plugin: 'stateful',
      state: 1
    })
  })

  test('Reset after one change', async () => {
    await change({ id: 'root', state: () => 1 })
    await reset()
    expect(selectors.getDocument(store.getState(), 'root')).toEqual({
      plugin: 'stateful',
      state: 0
    })
  })

  test('Reset after two changes', async () => {
    await change({ id: 'root', state: () => 1 })
    await change({ id: 'root', state: () => 2 })
    // undoStack: [[1, 2]]
    await reset()
    expect(selectors.getDocument(store.getState(), 'root')).toEqual({
      plugin: 'stateful',
      state: 0
    })
  })

  test('Reset after persist and undo', async () => {
    await change({ id: 'root', state: () => 1 })
    await change({ id: 'root', state: () => 2 })
    store.dispatch(actions.persist())
    await undo()
    await reset()
    expect(selectors.getDocument(store.getState(), 'root')).toEqual({
      plugin: 'stateful',
      state: 2
    })
  })
})

async function undo() {
  store.dispatch(actions.undo())
  await waitUntil(() =>
    R.any(action => action.type === pureUndo.type, store.getActions())
  )
}

async function redo() {
  store.dispatch(actions.redo())
  await waitUntil(() =>
    R.any(action => action.type === pureRedo.type, store.getActions())
  )
}

async function change(...args: Parameters<typeof actions.change>) {
  store.dispatch(actions.change(...args))
  await waitUntil(() =>
    R.any(action => action.type === commit.type, store.getActions())
  )
}

async function reset() {
  store.dispatch(actions.reset())
  await waitUntil(() =>
    R.any(action => action.type === pureReset.type, store.getActions())
  )
}
