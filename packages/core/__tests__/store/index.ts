import { plugins } from '../../__fixtures__/plugins'
import {
  ActionType,
  ChangeAction,
  getDocument,
  getDocuments,
  isFocused,
  reducer,
  serializeDocument,
  State
} from '../../src/store'
import { createDocument } from '../../src'

let state: State

beforeEach(() => {
  state = {
    defaultPlugin: 'default',
    plugins,
    documents: {}
  }
})

describe('Insert', () => {
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
    state = {
      ...state,
      documents: { '0': { plugin: 'stateless' } }
    }
    state = reducer(state, { type: ActionType.Remove, payload: '0' })
    expect(getDocuments(state)).toEqual({})
  })

  test('two documents', () => {
    state = {
      ...state,
      documents: { '0': { plugin: 'text' }, '1': { plugin: 'stateless' } }
    }
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
    state = {
      ...state,
      documents: { '0': { plugin: 'stateful' } }
    }
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
    state = reducer(state, {
      type: ActionType.Insert,
      payload: {
        id: '0',
        plugin: 'stateless'
      }
    })
    expect(serializeDocument(state, '0')).toEqual({
      type: '@edtr-io/document',
      plugin: 'stateless'
    })
  })

  test('stateful', () => {
    state = reducer(state, {
      type: ActionType.Insert,
      payload: {
        id: '0',
        plugin: 'stateful',
        state: { counter: 0 }
      }
    })
    expect(serializeDocument(state, '0')).toEqual({
      type: '@edtr-io/document',
      plugin: 'stateful',
      state: { counter: 0 }
    })
  })

  test('nested', () => {
    state = reducer(state, {
      type: ActionType.Insert,
      payload: {
        id: '0',
        plugin: 'nested',
        state: {
          child: createDocument({
            id: '1'
          })
        }
      }
    })
    // Note: this would usually be done automatically when rendering a <Document />
    state = reducer(state, {
      type: ActionType.Insert,
      payload: {
        id: '1',
        plugin: 'stateful',
        state: { counter: 0 }
      }
    })
    expect(serializeDocument(state, '0')).toEqual({
      type: '@edtr-io/document',
      plugin: 'nested',
      state: {
        child: {
          type: '@edtr-io/document',
          plugin: 'stateful',
          state: { counter: 0 }
        }
      }
    })
  })

  test('nested array', () => {
    state = reducer(state, {
      type: ActionType.Insert,
      payload: {
        id: '0',
        plugin: 'nestedArray',
        state: {
          children: [
            createDocument({
              id: '1'
            })
          ]
        }
      }
    })
    // Note: this would usually be done automatically when rendering a <Document />
    state = reducer(state, {
      type: ActionType.Insert,
      payload: {
        id: '1',
        plugin: 'stateful',
        state: { counter: 0 }
      }
    })
    expect(serializeDocument(state, '0')).toEqual({
      type: '@edtr-io/document',
      plugin: 'nestedArray',
      state: {
        children: [
          {
            type: '@edtr-io/document',
            plugin: 'stateful',
            state: { counter: 0 }
          }
        ]
      }
    })
  })
})

describe('history', () => {
  test('history contains initialState', () => {
    state = {
      ...state,
      documents: { '0': { plugin: 'stateful' } }
    }
    const initial = state

    state = reducer(state, {
      type: ActionType.Change,
      payload: {
        id: '0',
        state: () => ({ counter: 1 })
      }
    })
    expect(state.history).toBeDefined()
    if (!state.history) throw new Error('history not initialized')
    expect(state.history.initialState).toEqual(initial)
  })

  test('history remembers actions', () => {
    state = {
      ...state,
      documents: { '0': { plugin: 'stateful' } }
    }

    const action: ChangeAction = {
      type: ActionType.Change,
      payload: {
        id: '0',
        state: () => ({ counter: 1 })
      }
    }
    state = reducer(state, action)
    if (!state.history) throw new Error('history not initialized')
    expect(state.history.actions).toHaveLength(1)
    expect(state.history.actions[0]).toHaveLength(1)
    expect(state.history.actions[0][0]).toEqual(action)
  })

  test('undo change action', () => {
    state = {
      ...state,
      documents: { '0': { plugin: 'stateful' } }
    }
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
      plugin: 'stateful',
      state: { counter: 1 }
    })
  })
})
