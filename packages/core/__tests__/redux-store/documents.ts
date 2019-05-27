import * as R from 'ramda'

import { setupStore, waitUntil } from '../../__helpers__'
import { getDocument, insert, remove, change } from '../../src/redux-store'
import { getDocuments } from '../../src/redux-store/documents/reducer'
import { pureInsert, pureChange } from '../../src/redux-store/documents/actions'

let store: ReturnType<typeof setupStore>

beforeEach(() => {
  store = setupStore()
})

describe('Documents', () => {
  test('Initial state', () => {
    expect(getDocuments(store.getState())).toEqual({})
  })

  describe('Insert', () => {
    test('Default Plugin', async () => {
      store.dispatch(insert({ id: '0' }))
      await waitUntil(() =>
        R.any(action => action.type === pureInsert.type, store.getActions())
      )
      const doc = getDocument(store.getState(), '0')
      if (!doc) throw new Error('Document not found')
      expect(doc.plugin).toEqual('text')
    })

    test('Stateless Plugin', async () => {
      store.dispatch(
        insert({
          id: '1',
          plugin: 'stateless'
        })
      )
      await waitUntil(() =>
        R.any(action => action.type === pureInsert.type, store.getActions())
      )
      expect(getDocument(store.getState(), '1')).toEqual({
        plugin: 'stateless'
      })
    })
    test('Stateful plugin w/ state', async () => {
      store.dispatch(
        insert({
          id: '0',
          plugin: 'stateful',
          state: { counter: 0 }
        })
      )
      await waitUntil(() =>
        R.any(action => action.type === pureInsert.type, store.getActions())
      )
      expect(getDocument(store.getState(), '0')).toEqual({
        plugin: 'stateful',
        state: { counter: 0 }
      })
    })
  })

  describe('Remove', () => {
    test('One document', async () => {
      store.dispatch(
        insert({
          id: '1',
          plugin: 'stateless'
        })
      )
      await waitUntil(() =>
        R.any(action => action.type === pureInsert.type, store.getActions())
      )
      store.dispatch(remove('1'))
      expect(getDocuments(store.getState())).toEqual({})
    })
    test('Two documents', async () => {
      store.dispatch(
        insert({
          id: '1',
          plugin: 'stateless'
        })
      )
      store.dispatch(
        insert({
          id: '2',
          plugin: 'stateless'
        })
      )
      await waitUntil(
        () =>
          R.filter(
            action => action.type === pureInsert.type,
            store.getActions()
          ).length >= 2
      )
      store.dispatch(remove('1'))
      expect(getDocuments(store.getState())).toEqual({
        2: {
          plugin: 'stateless'
        }
      })
    })
    test('Non-existing document', async () => {
      store.dispatch(
        insert({
          id: '1',
          plugin: 'stateless'
        })
      )
      await waitUntil(() =>
        R.any(action => action.type === pureInsert.type, store.getActions())
      )
      store.dispatch(remove('2'))
      expect(R.values(getDocuments(store.getState()))).toHaveLength(1)
    })
  })

  describe('Change', () => {
    test('Whole state', async () => {
      store.dispatch(
        insert({
          id: '1',
          plugin: 'stateful',
          state: 0
        })
      )
      await waitUntil(() =>
        R.any(action => action.type === pureInsert.type, store.getActions())
      )
      store.dispatch(
        change({
          id: '1',
          state: () => 1
        })
      )
      await waitUntil(() =>
        R.any(action => action.type === pureChange.type, store.getActions())
      )
      expect(getDocument(store.getState(), '1')).toEqual({
        plugin: 'stateful',
        state: 1
      })
    })
  })
})
