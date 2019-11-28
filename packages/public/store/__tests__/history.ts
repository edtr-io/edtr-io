import { plugins } from '@edtr-io/internal__fixtures'
import * as R from 'ramda'

import { setupStore, TEST_SCOPE, wait, waitUntil } from '../__helpers__'
import * as S from '../src'
import { pureChange } from '../src/documents/actions'
import {
  commit,
  persist,
  pureRedo,
  pureReset,
  pureUndo,
  tempCommit
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
    const { initialState } = getHistory()(store.getState())
    if (!initialState) throw new Error('Expected initial state')
    expect(initialState.documents).toEqual({
      root: {
        plugin: 'stateful',
        state: 0
      }
    })
    expect(S.hasPendingChanges()(store.getState())).toEqual(false)
  })

  test('Changes will be committed to the history', async () => {
    await change({ id: 'root', state: () => 1 })
    expect(S.hasPendingChanges()(store.getState())).toEqual(true)
    const undoStack = getUndoStack()(store.getState())
    expect(undoStack).toHaveLength(1)
    expect(undoStack[0]).toHaveLength(1)
    expect(undoStack[0][0].action.type).toEqual(pureChange.type)
  })

  test('Commits will be added to the redo stack after reverting', async () => {
    await change({ id: 'root', state: () => 1 })
    await undo()
    expect(getUndoStack()(store.getState())).toHaveLength(0)
    expect(getRedoStack()(store.getState())).toHaveLength(1)
  })

  test('Redo stack will be purged after a commit', async () => {
    await change({ id: 'root', state: () => 1 })
    await undo()
    store.dispatch(S.change({ id: 'root', state: () => 2 }))
    expect(getUndoStack()(store.getState())).toHaveLength(1)
    expect(getRedoStack()(store.getState())).toHaveLength(0)
  })

  test('Undo reverts the last committed actions', async () => {
    await change({ id: 'root', state: () => 1 })
    await wait(1000)
    await change({ id: 'root', state: () => 2 })
    await undo()
    expect(S.getDocument('root')(store.getState())).toEqual({
      plugin: 'stateful',
      state: 1
    })
  })

  test('Redo replays the last reverted commit', async () => {
    await change({ id: 'root', state: () => 1 })
    await change({ id: 'root', state: () => 2 })
    await undo()
    await redo()
    expect(S.getDocument('root')(store.getState())).toEqual({
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
    expect(S.getDocument('root')(store.getState())).toEqual({
      plugin: 'stateful',
      state: 2
    })
    await undo()
    expect(S.getDocument('root')(store.getState())).toEqual({
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
    expect(S.getDocument('root')(store.getState())).toEqual({
      plugin: 'stateful',
      state: 1
    })
    await redo()
    expect(S.getDocument('root')(store.getState())).toEqual({
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
    expect(S.getDocument('root')(store.getState())).toEqual({
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
    expect(S.getDocument('root')(store.getState())).toEqual({
      plugin: 'stateful',
      state: 3
    })
  })

  test('Changes in a small time frame will be combined into a single commit', async () => {
    await change({ id: 'root', state: () => 1 })
    await change({ id: 'root', state: () => 2 })
    expect(getUndoStack()(store.getState())).toHaveLength(1)
  })

  test('Changes in a longer time frame will not be combined', async () => {
    await change({ id: 'root', state: () => 1 })
    await wait(1000)
    await change({ id: 'root', state: () => 2 })
    expect(getUndoStack()(store.getState())).toHaveLength(2)
  })

  test('Undo after redo', async () => {
    await change({ id: 'root', state: () => 1 })
    await wait(1000)
    await change({ id: 'root', state: () => 2 })
    await undo()
    await redo()
    await undo()
    expect(S.getDocument('root')(store.getState())).toEqual({
      plugin: 'stateful',
      state: 1
    })
  })

  test('Reset after one change', async () => {
    await change({ id: 'root', state: () => 1 })
    await reset()
    expect(S.getDocument('root')(store.getState())).toEqual({
      plugin: 'stateful',
      state: 0
    })
  })

  test('Reset after two changes', async () => {
    await change({ id: 'root', state: () => 1 })
    await change({ id: 'root', state: () => 2 })
    // undoStack: [[1, 2]]
    await reset()
    expect(S.getDocument('root')(store.getState())).toEqual({
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
    expect(S.getDocument('root')(store.getState())).toEqual({
      plugin: 'stateful',
      state: 2
    })
  })

  test('Undo insert', async () => {
    await insert({ id: '1', plugin: 'stateful', state: 2 })
    expect(S.getDocument('1')(store.getState())).toEqual({
      plugin: 'stateful',
      state: 2
    })
    await undo()
    expect(S.getDocument('1')(store.getState())).toEqual(null)
  })

  test('Undo remove', async () => {
    await insert({ id: '1', plugin: 'stateful', state: 2 })
    await wait(1000)
    await remove('1')
    expect(S.getDocument('1')(store.getState())).toEqual(null)
    await undo()
    expect(S.getDocument('1')(store.getState())).toEqual({
      plugin: 'stateful',
      state: 2
    })
  })

  test('Async change', async () => {
    store.dispatch(
      tempCommit({
        resolver: (resolve, _reject, _next) => {
          setTimeout(() => {
            resolve([
              {
                action: pureChange({ id: 'root', state: 2 })(TEST_SCOPE),
                reverse: pureChange({ id: 'root', state: 0 })(TEST_SCOPE)
              }
            ])
          }, 300)
        },
        initialActions: [
          {
            action: pureChange({ id: 'root', state: 1 })(TEST_SCOPE),
            reverse: pureChange({ id: 'root', state: 0 })(TEST_SCOPE)
          }
        ]
      })
    )
    expect(S.getDocument('root')(store.getState())).toEqual({
      plugin: 'stateful',
      state: 1
    })
    await wait(300)
    expect(S.getDocument('root')(store.getState())).toEqual({
      plugin: 'stateful',
      state: 2
    })
    expect(getUndoStack()(store.getState())).toHaveLength(1)
    expect(getUndoStack()(store.getState())[0]).toHaveLength(1)
  })

  test('Async change with continue', async () => {
    store.dispatch(
      tempCommit({
        resolver: (resolve, _reject, next) => {
          function firstAsyncUpdate() {
            setTimeout(() => {
              next([
                {
                  action: pureChange({ id: 'root', state: 2 })(TEST_SCOPE),
                  reverse: pureChange({ id: 'root', state: 0 })(TEST_SCOPE)
                }
              ])
              secondAsyncUpdate()
            }, 200)
          }
          function secondAsyncUpdate() {
            setTimeout(() => {
              next([
                {
                  action: pureChange({ id: 'root', state: 3 })(TEST_SCOPE),
                  reverse: pureChange({ id: 'root', state: 0 })(TEST_SCOPE)
                }
              ])
              finalAsyncUpdate()
            }, 200)
          }
          function finalAsyncUpdate() {
            setTimeout(() => {
              resolve([
                {
                  action: pureChange({ id: 'root', state: 5 })(TEST_SCOPE),
                  reverse: pureChange({ id: 'root', state: 0 })(TEST_SCOPE)
                }
              ])
            }, 200)
          }

          firstAsyncUpdate()
        },
        initialActions: [
          {
            action: pureChange({ id: 'root', state: 1 })(TEST_SCOPE),
            reverse: pureChange({ id: 'root', state: 0 })(TEST_SCOPE)
          }
        ]
      })
    )

    expect(S.getDocument('root')(store.getState())).toEqual({
      plugin: 'stateful',
      state: 1
    })
    await wait(200)
    expect(S.getDocument('root')(store.getState())).toEqual({
      plugin: 'stateful',
      state: 2
    })
    await wait(200)
    expect(S.getDocument('root')(store.getState())).toEqual({
      plugin: 'stateful',
      state: 3
    })
    await wait(200)
    expect(S.getDocument('root')(store.getState())).toEqual({
      plugin: 'stateful',
      state: 5
    })
    expect(getUndoStack()(store.getState())).toHaveLength(1)
    expect(getUndoStack()(store.getState())[0]).toHaveLength(1)
    await undo()
    expect(S.getDocument('root')(store.getState())).toEqual({
      plugin: 'stateful',
      state: 0
    })
    await redo()
    expect(S.getDocument('root')(store.getState())).toEqual({
      plugin: 'stateful',
      state: 5
    })
  })


  test('Async change with reject', async () => {
    store.dispatch(
      tempCommit({
        resolver: (_resolve, reject, _next) => {
          setTimeout(() => {
            reject([
              {
                action: pureChange({ id: 'root', state: -1 })(TEST_SCOPE),
                reverse: pureChange({ id: 'root', state: 0 })(TEST_SCOPE)
              }
            ])
          }, 300)
        },
        initialActions: [
          {
            action: pureChange({ id: 'root', state: 1 })(TEST_SCOPE),
            reverse: pureChange({ id: 'root', state: 0 })(TEST_SCOPE)
          }
        ]
      })
    )
    expect(S.getDocument('root')(store.getState())).toEqual({
      plugin: 'stateful',
      state: 1
    })
    await wait(300)
    expect(S.getDocument('root')(store.getState())).toEqual({
      plugin: 'stateful',
      state: -1
    })
    expect(getUndoStack()(store.getState())).toHaveLength(1)
    expect(getUndoStack()(store.getState())[0]).toHaveLength(1)
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

async function insert(...args: Parameters<typeof S.insert>) {
  store.dispatch(S.insert(...args))
  await waitUntil(() =>
    R.any(action => action.type === commit.type, store.getActions())
  )
}

async function remove(...args: Parameters<typeof S.remove>) {
  store.dispatch(S.remove(...args))
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
