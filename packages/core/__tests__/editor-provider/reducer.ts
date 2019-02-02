import {
  createStateReducer,
  Reducer,
  StateActionType
} from '../../src/editor-provider/reducer'
import { PluginRegistry } from '../../src/editor-provider/plugin-registry'
import { plugins } from '.'

let reducer: ReturnType<typeof createStateReducer>
let state: Reducer

beforeEach(() => {
  const registry = new PluginRegistry<string>(plugins)
  reducer = createStateReducer({
    defaultPlugin: 'default',
    registry: registry
  })
  state = {}
})

test('empty state', () => {
  expect(state).toEqual({})
})

test('insert', () => {
  state = reducer(state, {
    type: StateActionType.Insert,
    payload: {
      id: '0',
      type: 'stateless'
    }
  })
  expect(state[0]).toEqual({ type: 'stateless' })
})

test('insert default plugin', () => {
  state = reducer(state, {
    type: StateActionType.Insert,
    payload: {
      id: '0'
    }
  })
  expect(state[0]).toEqual({ type: 'default' })
})

test('insert stateful plugin', () => {
  state = reducer(state, {
    type: StateActionType.Insert,
    payload: {
      id: '0',
      type: 'stateful'
    }
  })
  expect(state[0]).toEqual({
    type: 'stateful',
    state: {
      counter: 0
    }
  })
})

test('remove', () => {
  state = { '0': { type: 'stateless' } }
  state = reducer(state, { type: StateActionType.Remove, payload: '0' })
  expect(state).toEqual({})
})

test('remove one', () => {
  state = { '0': { type: 'text' }, '1': { type: 'stateless' } }
  state = reducer(state, { type: StateActionType.Remove, payload: '0' })
  expect(state).toEqual({ '1': { type: 'stateless' } })
})

test('remove not existing plugin', () => {
  state = reducer(state, { type: StateActionType.Remove, payload: '0' })
  expect(state).toEqual({})
})

test('change', () => {
  state = { '0': { type: 'stateful' } }
  state = reducer(state, {
    type: StateActionType.Change,
    payload: {
      id: '0',
      state: { counter: 1 }
    }
  })
  expect(state[0]).toEqual({ type: 'stateful', state: { counter: 1 } })
})

test('shallow change', () => {
  state = { '0': { type: 'stateful', state: { counter: 0, bar: 'bar' } } }
  state = reducer(state, {
    type: StateActionType.Change,
    payload: {
      id: '0',
      state: { counter: 1 }
    }
  })
  expect(state[0]).toEqual({
    type: 'stateful',
    state: { counter: 1, bar: 'bar' }
  })
})

test('try changing missing plugin', () => {
  state = reducer(state, {
    type: StateActionType.Change,
    payload: {
      id: '0',
      state: { counter: 0 }
    }
  })
  expect(state).toEqual({})
})
