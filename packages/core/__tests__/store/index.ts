import { plugins } from '../editor-provider'
import {
  reducer,
  State,
  ActionType,
  getDocuments,
  getDocument
} from '../../src/store'

let state: State

beforeEach(() => {
  state = {
    defaultPlugin: 'default',
    plugins,
    documents: {}
  }
})

test('insert', () => {
  state = reducer(state, {
    type: ActionType.Insert,
    payload: {
      id: '0',
      plugin: 'stateless'
    }
  })
  expect(getDocument(state, '0')).toEqual({ plugin: 'stateless' })
})

test('insert default plugin', () => {
  state = reducer(state, {
    type: ActionType.Insert,
    payload: {
      id: '0'
    }
  })
  expect(getDocument(state, '0')).toEqual({ plugin: 'default' })
})

test('insert stateful plugin', () => {
  state = reducer(state, {
    type: ActionType.Insert,
    payload: {
      id: '0',
      plugin: 'stateful'
    }
  })
  expect(getDocument(state, '0')).toEqual({
    plugin: 'stateful',
    state: {
      counter: 0
    }
  })
})

test('remove', () => {
  state = {
    ...state,
    documents: { '0': { plugin: 'stateless' } }
  }
  state = reducer(state, { type: ActionType.Remove, payload: '0' })
  expect(getDocuments(state)).toEqual({})
})

test('remove one', () => {
  state = {
    ...state,
    documents: { '0': { plugin: 'text' }, '1': { plugin: 'stateless' } }
  }
  state = reducer(state, { type: ActionType.Remove, payload: '0' })
  expect(getDocuments(state)).toEqual({ '1': { plugin: 'stateless' } })
})

test('remove not existing plugin', () => {
  state = reducer(state, { type: ActionType.Remove, payload: '0' })
  expect(getDocuments(state)).toEqual({})
})

test('change', () => {
  state = {
    ...state,
    documents: { '0': { plugin: 'stateful' } }
  }
  state = reducer(state, {
    type: ActionType.Change,
    payload: {
      id: '0',
      state: { counter: 1 }
    }
  })
  expect(getDocument(state, '0')).toEqual({
    plugin: 'stateful',
    state: { counter: 1 }
  })
})

test('shallow change', () => {
  state = {
    ...state,
    documents: {
      '0': { plugin: 'stateful', state: { counter: 0, bar: 'bar' } }
    }
  }
  state = reducer(state, {
    type: ActionType.Change,
    payload: {
      id: '0',
      state: { counter: 1 }
    }
  })
  expect(getDocument(state, '0')).toEqual({
    plugin: 'stateful',
    state: { counter: 1, bar: 'bar' }
  })
})

test('try changing missing plugin', () => {
  state = reducer(state, {
    type: ActionType.Change,
    payload: {
      id: '0',
      state: { counter: 0 }
    }
  })
  expect(getDocuments(state)).toEqual({})
})
