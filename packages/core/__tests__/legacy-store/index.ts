import * as R from 'ramda'
import { plugins } from '../../__fixtures__/plugins'
import {
  ActionCommitType,
  ActionType,
  BaseState,
  getDocument,
  hasPendingChanges,
  PersistAction,
  reducer,
  State,
  Undoable
} from '../../src/legacy-store'

let state: State

beforeEach(() => {
  state = createInitialState({
    defaultPlugin: 'default',
    plugins,
    documents: {}
  })
})

describe('history', () => {
  test('history combines debounced changes', () => {
    state = createInitialState({
      ...state,
      documents: { '0': { plugin: 'stateful' } }
    })
    state = reducer(state, {
      type: ActionType.Change,
      payload: {
        id: '0',
        state: () => ({ counter: 1 })
      }
    })
    expect(state.history.actions).toHaveLength(1)
    state = reducer(state, {
      type: ActionType.Change,
      payload: {
        id: '0',
        state: () => ({ counter: 2 })
      }
    })
    expect(state.history.actions).toHaveLength(1)

    state = reducer(state, {
      type: ActionType.Change,
      payload: {
        id: '0',
        state: () => ({ counter: 4 })
      },
      commit: ActionCommitType.ForceCommit
    })
    expect(state.history.actions).toHaveLength(2)
    state = reducer(state, {
      type: ActionType.Change,
      payload: {
        id: '0',
        state: () => ({ counter: 2 })
      }
    })
    expect(state.history.actions).toHaveLength(3)
  })

  test('undo/redo works with debounced changes', () => {
    state = createInitialState({
      ...state,
      documents: { '0': { plugin: 'stateful' } }
    })
    state = reducer(state, {
      type: ActionType.Change,
      payload: {
        id: '0',
        state: () => ({ counter: 1 })
      }
    })
    state = reducer(state, {
      type: ActionType.Change,
      payload: {
        id: '0',
        state: () => ({ counter: 2 })
      }
    })

    state = reducer(state, {
      type: ActionType.Undo
    })
    expect(getDocument(state, '0')).toEqual({
      plugin: 'stateful'
    })
    state = reducer(state, {
      type: ActionType.Redo
    })
    expect(getDocument(state, '0')).toEqual({
      plugin: 'stateful',
      state: { counter: 2 }
    })
  })
})

describe('persist', () => {
  test('hasPendingChanges returns false at start and after persist', () => {
    expect(hasPendingChanges(state)).toEqual(false)
    state = reducer(state, {
      type: ActionType.Insert,
      payload: {
        id: '0',
        plugin: 'stateful',
        state: { counter: 0 }
      }
    })
    state = reducer(state, {
      type: ActionType.Change,
      payload: {
        id: '0',
        state: () => ({ counter: 1 })
      },
      commit: ActionCommitType.ForceCommit
    })

    expect(hasPendingChanges(state)).toEqual(true)

    state = reducer(state, {
      type: ActionType.Persist
    })

    expect(hasPendingChanges(state)).toEqual(false)
  })

  test('undo/redo after persist work', () => {
    const insertAction: Undoable = {
      type: ActionType.Insert,
      payload: {
        id: '0',
        plugin: 'stateful',
        state: { counter: 0 }
      }
    }
    const changeAction: Undoable = {
      type: ActionType.Change,
      payload: {
        id: '0',
        state: () => ({ counter: 1 })
      },
      commit: ActionCommitType.ForceCommit
    }

    const persistAction: PersistAction = {
      type: ActionType.Persist
    }

    state = reducer(state, insertAction)
    const stateBeforeChange = { ...state }
    state = reducer(state, changeAction)
    state = reducer(state, persistAction)
    const stateAfterPersist = { ...state }

    // check undo
    state = reducer(state, {
      type: ActionType.Undo
    })
    expect(hasPendingChanges(state)).toEqual(true)
    expect(R.omit(['history'], state)).toEqual(
      R.omit(['history'], stateBeforeChange)
    )
    expect(state.history.redoStack).toHaveLength(1)

    //check redos
    state = reducer(state, {
      type: ActionType.Redo
    })

    expect(state).toEqual(stateAfterPersist)
  })

  test("persist doesn't remove redos", () => {
    state = reducer(state, {
      type: ActionType.Insert,
      payload: {
        id: '0',
        plugin: 'stateful',
        state: { counter: 0 }
      }
    })
    state = reducer(state, {
      type: ActionType.Change,
      payload: {
        id: '0',
        state: () => ({ counter: 1 })
      },
      commit: ActionCommitType.ForceCommit
    })

    state = reducer(state, {
      type: ActionType.Undo
    })

    expect(hasPendingChanges(state)).toEqual(true)
    expect(state.history.redoStack).toHaveLength(1)
    const redoStack = [...state.history.redoStack]

    state = reducer(state, {
      type: ActionType.Persist
    })

    expect(hasPendingChanges(state)).toEqual(false)
    expect(state.history.redoStack).toEqual(redoStack)
  })
})

function createInitialState(baseState: BaseState): State {
  return {
    ...baseState,
    history: {
      initialState: baseState,
      actions: [],
      redoStack: [],
      pending: 0
    },
    clipboard: [],
    editable: true
  }
}
