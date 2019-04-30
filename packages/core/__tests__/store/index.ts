import * as R from 'ramda'

import { plugins } from '../../__fixtures__/plugins'
import {
  ActionCommitType,
  ActionType,
  AsyncChangeAction,
  AsyncInsertAction,
  BaseState,
  ChangeAction,
  getClipboard,
  getDocument,
  getDocuments,
  hasPendingChanges,
  isFocused,
  PersistAction,
  reducer,
  serializeDocument,
  State,
  Undoable
} from '../../src/store'
import { Store } from 'redux'
import { createStore } from '../../src/editor'
import { renderDocument } from '../index'

let state: State

beforeEach(() => {
  state = createInitialState({
    defaultPlugin: 'default',
    plugins,
    documents: {}
  })
})

describe('insert', () => {
  test('default plugin', () => {
    state = reducer(state, {
      type: ActionType.Insert,
      payload: {
        id: '0'
      }
    })
    expect(getDocument(state, '0')).toEqual({ plugin: 'default' })
  })

  test('stateless plugin', () => {
    state = reducer(state, {
      type: ActionType.Insert,
      payload: {
        id: '0',
        plugin: 'stateless'
      }
    })
    expect(getDocument(state, '0')).toEqual({ plugin: 'stateless' })
  })

  test('stateful plugin', () => {
    state = reducer(state, {
      type: ActionType.Insert,
      payload: {
        id: '0',
        plugin: 'stateful',
        state: { counter: 0 }
      }
    })
    expect(getDocument(state, '0')).toEqual({
      plugin: 'stateful',
      state: {
        counter: 0
      }
    })
  })
})

describe('remove', () => {
  test('one document', () => {
    state = createInitialState({
      ...state,
      documents: { '0': { plugin: 'stateless' } }
    })
    state = reducer(state, { type: ActionType.Remove, payload: '0' })
    expect(getDocuments(state)).toEqual({})
  })

  test('two documents', () => {
    state = createInitialState({
      ...state,
      documents: { '0': { plugin: 'text' }, '1': { plugin: 'stateless' } }
    })
    state = reducer(state, { type: ActionType.Remove, payload: '0' })
    expect(getDocuments(state)).toEqual({ '1': { plugin: 'stateless' } })
  })

  test('non-existing document', () => {
    state = reducer(state, { type: ActionType.Remove, payload: '0' })
    expect(getDocuments(state)).toEqual({})
  })
})

describe('change', () => {
  test('whole state', () => {
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
    expect(getDocument(state, '0')).toEqual({
      plugin: 'stateful',
      state: { counter: 1 }
    })
  })

  test('non-existing plugin', () => {
    state = reducer(state, {
      type: ActionType.Change,
      payload: {
        id: '0',
        state: () => ({ counter: 1 })
      }
    })
    expect(getDocuments(state)).toEqual({})
  })
})

describe('focus', () => {
  test('not focused by default', () => {
    expect(isFocused(state, '0')).toEqual(false)
  })

  test('focused after focus action', () => {
    state = reducer(state, {
      type: ActionType.Focus,
      payload: '0'
    })
    expect(isFocused(state, '0')).toEqual(true)
  })

  test('not focused anymore after another focus action', () => {
    state = reducer(state, {
      type: ActionType.Focus,
      payload: '0'
    })
    state = reducer(state, {
      type: ActionType.Focus,
      payload: '1'
    })
    expect(isFocused(state, '0')).toEqual(false)
  })

  test('a newly inserted element gets focused', () => {
    state = reducer(state, {
      type: ActionType.Insert,
      payload: {
        plugin: 'stateless',
        id: '0'
      }
    })
    expect(isFocused(state, '0')).toEqual(true)
  })
})

describe('serialize', () => {
  test('stateless', () => {
    state = createInitialState({
      ...state,
      documents: { root: { plugin: 'stateless' } }
    })
    expect(serializeDocument(state)).toEqual({
      plugin: 'stateless'
    })
  })

  test('stateful', () => {
    state = createInitialState({
      ...state,
      documents: { root: { plugin: 'stateful', state: { counter: 0 } } }
    })
    expect(serializeDocument(state)).toEqual({
      plugin: 'stateful',
      state: { counter: 0 }
    })
  })

  test('nested', () => {
    state = createInitialState({
      ...state,
      documents: {
        root: { plugin: 'nested', state: { child: 'child0' } },
        child0: { plugin: 'stateful', state: 0 }
      }
    })
    expect(serializeDocument(state)).toEqual({
      plugin: 'nested',
      state: {
        child: {
          plugin: 'stateful',
          state: 0
        }
      }
    })
  })

  test('nested array', () => {
    state = createInitialState({
      ...state,
      documents: {
        root: {
          plugin: 'nestedArray',
          state: { children: [{ id: 'pos0', value: 'child0' }] }
        },
        child0: { plugin: 'stateful', state: 1 }
      }
    })
    expect(serializeDocument(state)).toEqual({
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

  test('nested inside nested', () => {
    state = createInitialState({
      ...state,
      documents: {
        root: {
          plugin: 'nestedArray',
          state: {
            children: [
              { id: 'pos0', value: 'child0' },
              { id: 'pos1', value: 'child1' }
            ]
          }
        },
        child0: { plugin: 'stateful', state: 1 },
        child1: { plugin: 'nested', state: { child: 'child2' } },
        child2: { plugin: 'stateful', state: 2 }
      }
    })

    expect(serializeDocument(state)).toEqual({
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

describe('history', () => {
  test('history contains initialState', () => {
    const initial = {
      ...state,
      documents: { '0': { plugin: 'stateful' } }
    }
    state = createInitialState(initial)

    state = reducer(state, {
      type: ActionType.Change,
      payload: {
        id: '0',
        state: () => ({ counter: 1 })
      }
    })
    expect(state.history).toBeDefined()
    expect(state.history.initialState).toEqual(initial)
  })

  test('history remembers actions', () => {
    state = createInitialState({
      ...state,
      documents: { '0': { plugin: 'stateful' } }
    })

    const action: ChangeAction = {
      type: ActionType.Change,
      payload: {
        id: '0',
        state: () => ({ counter: 1 })
      }
    }
    state = reducer(state, action)
    expect(state.history.actions).toHaveLength(1)
    expect(state.history.actions[0]).toHaveLength(1)
    expect(state.history.actions[0][0]).toEqual(action)
  })

  test('history remembers undos for redo', () => {
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
      type: ActionType.Undo
    })
    expect(state.history.redoStack).toHaveLength(1)
    expect(state.history.actions).toHaveLength(0)

    state = reducer(state, {
      type: ActionType.Redo
    })
    expect(state.history.redoStack).toHaveLength(0)
    expect(state.history.actions).toHaveLength(1)
  })

  test('history purges redos after change', () => {
    state = createInitialState({
      ...state,
      documents: { '0': { plugin: 'stateful' } }
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
    expect(state.history.redoStack).toHaveLength(1)
    expect(state.history.actions).toHaveLength(0)

    state = reducer(state, {
      type: ActionType.Change,
      payload: {
        id: '0',
        state: () => ({ counter: 2 })
      },
      commit: ActionCommitType.ForceCommit
    })

    expect(state.history.redoStack).toHaveLength(0)
    expect(state.history.actions).toHaveLength(1)
  })

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

  test('undo change action', () => {
    state = createInitialState({
      ...state,
      documents: { '0': { plugin: 'stateful' } }
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
      type: ActionType.Change,
      payload: {
        id: '0',
        state: () => ({ counter: 2 })
      },
      commit: ActionCommitType.ForceCommit
    })
    state = reducer(state, {
      type: ActionType.Undo
    })

    expect(getDocument(state, '0')).toEqual({
      plugin: 'stateful',
      state: { counter: 1 }
    })
  })

  test('redo change action', () => {
    state = createInitialState({
      ...state,
      documents: { '0': { plugin: 'stateful' } }
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
      type: ActionType.Change,
      payload: {
        id: '0',
        state: () => ({ counter: 2 })
      },
      commit: ActionCommitType.ForceCommit
    })
    state = reducer(state, {
      type: ActionType.Undo
    })
    state = reducer(state, {
      type: ActionType.Redo
    })

    expect(getDocument(state, '0')).toEqual({
      plugin: 'stateful',
      state: { counter: 2 }
    })
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

describe('copyToClipboard', () => {
  test('copy stateful', () => {
    state = reducer(state, {
      type: ActionType.Insert,
      payload: {
        id: '0',
        plugin: 'stateful',
        state: { counter: 0 }
      }
    })

    state = reducer(state, {
      type: ActionType.CopyToClipboard,
      payload: '0'
    })

    expect(getClipboard(state)).toEqual([
      {
        plugin: 'stateful',
        state: { counter: 0 }
      }
    ])
  })

  test('copy nested', () => {
    state = createInitialState({
      ...state,
      documents: {
        '0': { plugin: 'stateful', state: 0 },
        '1': { plugin: 'nested', state: { child: '0' } }
      }
    })

    state = reducer(state, {
      type: ActionType.InitRoot,
      payload: {
        plugin: 'nested',
        state: {
          child: { plugin: 'stateful', state: 0 }
        }
      }
    })

    state = reducer(state, {
      type: ActionType.CopyToClipboard,
      payload: '1'
    })

    expect(getClipboard(state)).toEqual([
      {
        plugin: 'nested',
        state: {
          child: { plugin: 'stateful', state: 0 }
        }
      }
    ])
  })
})

describe('history for sagas', () => {
  let store: Store

  beforeEach(() => {
    store = createStore(plugins, 'stateful', true)
    renderDocument(store)
  })

  test('history remembers actions', () => {
    const action: AsyncInsertAction = {
      type: ActionType.AsyncInsert,
      payload: {
        id: 'root',
        plugin: 'stateful',
        state: {
          immediateState: 1,
          asyncState: new Promise(resolve =>
            setTimeout(function() {
              resolve(2)
            }, 100)
          )
        }
      },
      commit: ActionCommitType.ForceCommit
    }
    store.dispatch(action)

    let insertAction: Undoable = {
      type: ActionType.Insert,
      payload: {
        id: 'root',
        plugin: 'stateful',
        state: 1
      },
      commit: ActionCommitType.ForceCommit
    }
    state = store.getState()
    expect(state.history.actions).toHaveLength(2)
    expect(state.history.actions[1]).toHaveLength(1)
    expect(state.history.actions[1][0]).toEqual(insertAction)

    return new Promise(resolve =>
      setTimeout(function() {
        insertAction = {
          type: ActionType.Insert,
          payload: {
            id: 'root',
            plugin: 'stateful',
            state: 2
          },
          commit: ActionCommitType.ForceCommit
        }

        state = store.getState()
        expect(state.history.actions).toHaveLength(3)
        expect(state.history.actions[2]).toHaveLength(1)
        expect(state.history.actions[2][0]).toEqual(insertAction)
        resolve(true)
      }, 200)
    )
  })

  test('history remembers undos for redo', () => {
    const action: AsyncChangeAction = {
      type: ActionType.AsyncChange,
      payload: {
        id: 'root',
        state: () => ({
          immediateState: 1,
          asyncState: new Promise(resolve =>
            setTimeout(function() {
              resolve(2)
            }, 100)
          )
        })
      },
      commit: ActionCommitType.ForceCommit
    }

    store.dispatch(action)

    return new Promise(resolve =>
      setTimeout(function() {
        store.dispatch({
          type: ActionType.Undo
        })

        state = store.getState()
        expect(state.history.redoStack).toHaveLength(1)
        expect(state.history.actions).toHaveLength(2)

        store.dispatch({
          type: ActionType.Redo
        })

        state = store.getState()
        expect(state.history.redoStack).toHaveLength(0)
        expect(state.history.actions).toHaveLength(3)

        resolve(true)
      }, 200)
    )
  })

  test('history purges redos after change', () => {
    let action: AsyncChangeAction = {
      type: ActionType.AsyncChange,
      payload: {
        id: 'root',
        state: () => ({
          immediateState: 1,
          asyncState: new Promise(resolve =>
            setTimeout(function() {
              resolve(2)
            }, 100)
          )
        })
      },
      commit: ActionCommitType.ForceCommit
    }
    store.dispatch(action)

    return new Promise(resolve =>
      setTimeout(function() {
        store.dispatch({
          type: ActionType.Undo
        })

        state = store.getState()
        expect(state.history.redoStack).toHaveLength(1)
        expect(state.history.actions).toHaveLength(2)

        action = {
          type: ActionType.AsyncChange,
          payload: {
            id: 'root',
            state: () => ({
              immediateState: 3
            })
          },
          commit: ActionCommitType.ForceCommit
        }
        store.dispatch(action)

        state = store.getState()
        expect(state.history.redoStack).toHaveLength(0)
        expect(state.history.actions).toHaveLength(3)

        resolve(true)
      }, 200)
    )
  })

  test('history combines debounced changes', () => {
    let action: AsyncChangeAction = {
      type: ActionType.AsyncChange,
      payload: {
        id: 'root',
        state: () => ({
          immediateState: 1,
          asyncState: new Promise(resolve =>
            setTimeout(function() {
              resolve(2)
            }, 100)
          )
        })
      }
    }
    store.dispatch(action)

    state = store.getState()
    expect(state.history.actions).toHaveLength(1)
    expect(state.history.actions[0]).toHaveLength(2)

    return new Promise(resolve =>
      setTimeout(function() {
        state = store.getState()
        expect(state.history.actions).toHaveLength(1)
        expect(state.history.actions[0]).toHaveLength(3)

        action = {
          type: ActionType.AsyncChange,
          payload: {
            id: 'root',
            state: () => ({
              immediateState: 3,
              asyncState: new Promise(resolve =>
                setTimeout(function() {
                  resolve(4)
                }, 100)
              )
            })
          },
          commit: ActionCommitType.ForceCommit
        }
        store.dispatch(action)

        state = store.getState()
        expect(state.history.actions).toHaveLength(2)

        return new Promise(resolveInner =>
          setTimeout(function() {
            state = store.getState()
            expect(state.history.actions).toHaveLength(3)

            resolveInner(true)
            resolve(true)
          }, 200)
        )
      }, 200)
    )
  })

  test('undo change action', () => {
    let action: AsyncChangeAction = {
      type: ActionType.AsyncChange,
      payload: {
        id: 'root',
        state: () => ({
          immediateState: 1,
          asyncState: new Promise(resolve =>
            setTimeout(function() {
              resolve(2)
            }, 100)
          )
        })
      },
      commit: ActionCommitType.ForceCommit
    }
    store.dispatch(action)

    return new Promise(resolve =>
      setTimeout(function() {
        expect(getDocument(store.getState(), 'root')).toEqual({
          plugin: 'stateful',
          state: 2
        })

        store.dispatch({
          type: ActionType.Undo
        })

        expect(getDocument(store.getState(), 'root')).toEqual({
          plugin: 'stateful',
          state: 1
        })

        resolve(true)
      }, 200)
    )
  })

  test('redo change action', () => {
    let action: AsyncChangeAction = {
      type: ActionType.AsyncChange,
      payload: {
        id: 'root',
        state: () => ({
          immediateState: 1,
          asyncState: new Promise(resolve =>
            setTimeout(function() {
              resolve(2)
            }, 100)
          )
        })
      },
      commit: ActionCommitType.ForceCommit
    }
    store.dispatch(action)

    return new Promise(resolve =>
      setTimeout(function() {
        expect(getDocument(store.getState(), 'root')).toEqual({
          plugin: 'stateful',
          state: 2
        })

        store.dispatch({
          type: ActionType.Undo
        })
        store.dispatch({
          type: ActionType.Redo
        })

        expect(getDocument(store.getState(), 'root')).toEqual({
          plugin: 'stateful',
          state: 2
        })

        resolve(true)
      }, 200)
    )
  })

  test('undo/redo works with debounced changes', () => {
    let action: AsyncChangeAction = {
      type: ActionType.AsyncChange,
      payload: {
        id: 'root',
        state: () => ({
          immediateState: 0
        })
      },
      commit: ActionCommitType.ForceCommit
    }
    store.dispatch(action)

    action = {
      type: ActionType.AsyncChange,
      payload: {
        id: 'root',
        state: () => ({
          immediateState: 1,
          asyncState: new Promise(resolve =>
            setTimeout(function() {
              resolve(2)
            }, 100)
          )
        })
      }
    }
    store.dispatch(action)

    return new Promise(resolve =>
      setTimeout(function() {
        expect(getDocument(store.getState(), 'root')).toEqual({
          plugin: 'stateful',
          state: 2
        })

        store.dispatch({
          type: ActionType.Undo
        })

        expect(getDocument(store.getState(), 'root')).toEqual({
          plugin: 'stateful',
          state: 0
        })

        store.dispatch({
          type: ActionType.Redo
        })

        expect(getDocument(store.getState(), 'root')).toEqual({
          plugin: 'stateful',
          state: 2
        })

        resolve(true)
      }, 200)
    )
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
    editable: true,
    root: 'root'
  }
}
