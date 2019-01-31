import { createStateReducer, EditorState, StateActionType } from '../src'

let reducer: ReturnType<typeof createStateReducer>
let state: EditorState

beforeEach(() => {
  reducer = createStateReducer({
    defaultPlugin: 'default',
    generateId() {
      return '0'
    }
  })
  state = reducer()
})

test('empty state', () => {
  expect(state).toEqual({})
})

test('insert', () => {
  state = reducer(state, { type: StateActionType.Insert, payload: 'text' })
  expect(state[0]).toEqual({ type: 'text' })
})

test('insert default plugin', () => {
  state = reducer(state, { type: StateActionType.Insert })
  expect(state[0]).toEqual({ type: 'default' })
})

test('change', () => {
  state = { '0': { type: 'text' } }
  state = reducer(state, {
    type: StateActionType.Change,
    payload: {
      id: '0',
      state: { foo: 'bar' }
    }
  })
  expect(state[0]).toEqual({ type: 'text', state: { foo: 'bar' } })
})

test('shallow change', () => {
  state = { '0': { type: 'text', state: { foo: 'foo', bar: 'bar' } } }
  state = reducer(state, {
    type: StateActionType.Change,
    payload: {
      id: '0',
      state: { foo: 'bar' }
    }
  })
  expect(state[0]).toEqual({ type: 'text', state: { foo: 'bar', bar: 'bar' } })
})

test('try changeing missing plugin', () => {
  state = reducer(state, {
    type: StateActionType.Change,
    payload: {
      id: '0',
      state: { foo: 'bar' }
    }
  })
  expect(state).toEqual({})
})
