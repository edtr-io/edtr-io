import * as R from 'ramda'

import { plugins } from '../../__fixtures__/plugins'
import {
  change,
  insert,
  remove,
  setEditable
} from '../../src/redux-store/actions'
import {
  getDefaultPlugin,
  getPlugin,
  getDocuments,
  getFocused,
  isEditable
} from '../../src/redux-store/reducer'
import { createStore } from '../../src/redux-store/store'

let store: ReturnType<typeof createStore>['store']

beforeEach(() => {
  store = createStore({
    plugins,
    defaultPlugin: 'text'
  }).store
})

describe('Mode', () => {
  test('Initial state', () => {
    expect(isEditable(store.getState())).toEqual(true)
  })
  test('Set editable to false', () => {
    store.dispatch(setEditable(false))
    expect(isEditable(store.getState())).toEqual(false)
  })
  test('Set editable to true', () => {
    store.dispatch(setEditable(true))
    expect(isEditable(store.getState())).toEqual(true)
  })
})

describe('Plugins', () => {
  describe('Default plugin', () => {
    test('Initial state', () => {
      expect(getDefaultPlugin(store.getState())).toEqual('text')
    })
  })
  describe('Plugins', () => {
    test('Existing plugins', () => {
      expect(getPlugin(store.getState(), 'text')).toBeDefined()
    })
    test('Non-existing plugin', () => {
      expect(getPlugin(store.getState(), 'foobar')).toBeNull()
    })
  })
})

describe('Documents', () => {
  test('Initial state', () => {
    expect(getDocuments(store.getState())).toEqual({})
  })
  describe('Insert', () => {
    test('Stateless plugin', () => {
      store.dispatch(
        insert({
          id: '1',
          plugin: 'stateless'
        })
      )
      expect(getDocuments(store.getState())).toEqual({
        1: {
          plugin: 'stateless',
          state: undefined
        }
      })
    })
    test('Stateful plugin w/ state', () => {
      store.dispatch(
        insert({
          id: '1',
          plugin: 'stateful',
          state: 1
        })
      )
      expect(getDocuments(store.getState())).toEqual({
        1: {
          plugin: 'stateful',
          state: 1
        }
      })
    })
  })
  describe('Remove', () => {
    test('Existing document', () => {
      store.dispatch(
        insert({
          id: '1',
          plugin: 'stateless'
        })
      )
      expect(R.values(getDocuments(store.getState()))).toHaveLength(1)
      store.dispatch(remove('1'))
      expect(getDocuments(store.getState())).toEqual({})
    })
    test('Non-existing document', () => {
      store.dispatch(
        insert({
          id: '1',
          plugin: 'stateless'
        })
      )
      store.dispatch(remove('2'))
      expect(R.values(getDocuments(store.getState()))).toHaveLength(1)
    })
  })
  describe('Change', () => {
    test('Existing document', () => {
      store.dispatch(
        insert({
          id: '1',
          plugin: 'stateful',
          state: 0
        })
      )
      store.dispatch(
        change({
          id: '1',
          state: 1
        })
      )
      expect(getDocuments(store.getState())).toEqual({
        1: {
          plugin: 'stateful',
          state: 1
        }
      })
    })
  })
})

describe('Focus', () => {
  test('Initial state', () => {
    expect(getFocused(store.getState())).toBeNull()
  })
})
