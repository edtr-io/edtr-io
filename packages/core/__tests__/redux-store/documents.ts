import * as R from 'ramda'

import { setupStore, waitUntil } from '../../__helpers__'
import {
  getDocument,
  getDocuments,
  insert,
  remove,
  change,
  asyncInsert
} from '../../src/redux-store'

let store: ReturnType<typeof setupStore>

beforeEach(() => {
  store = setupStore()
})

describe('Documents', () => {
  test('Initial state', () => {
    expect(getDocuments(store.getState())).toEqual({})
  })

  describe('Insert', () => {
    test('Default Plugin', () => {
      store.dispatch(asyncInsert({ id: '0' }))
      return waitUntil(() => store.getActions().length >= 2).then(() => {
        const doc = getDocument(store.getState(), '0')
        if (!doc) throw new Error('Document not found')
        expect(doc.plugin).toEqual('text')
      })
    })

    test('Stateless Plugin', () => {
      store.dispatch(
        asyncInsert({
          id: '1',
          plugin: 'stateless'
        })
      )
      return waitUntil(() => store.getActions().length >= 2).then(() => {
        expect(getDocument(store.getState(), '1')).toEqual({
          plugin: 'stateless'
        })
      })
    })
    test('Stateful plugin w/ state', () => {
      store.dispatch(
        asyncInsert({
          id: '0',
          plugin: 'stateful',
          state: { counter: 0 }
        })
      )
      return waitUntil(() => store.getActions().length >= 2).then(() => {
        expect(getDocument(store.getState(), '0')).toEqual({
          plugin: 'stateful',
          state: { counter: 0 }
        })
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
