import * as R from 'ramda'

import { plugins } from '../../__fixtures__/plugins'
import {
  createStore,
  getDocuments,
  insert,
  remove,
  change
} from '../../src/redux-store'

let store: ReturnType<typeof createStore>['store']

beforeEach(() => {
  store = createStore({
    plugins,
    defaultPlugin: 'text'
  }).store
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
