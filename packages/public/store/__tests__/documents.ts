import * as R from 'ramda'

import { setupStore, waitUntil } from '../__helpers__'
import * as S from '../src'
import { pureInsert, pureChange, pureReplace } from '../src/documents/actions'
import { getDocuments } from '../src/documents/reducer'

let store: ReturnType<typeof setupStore>

beforeEach(() => {
  store = setupStore()
})

describe('Documents', () => {
  test('Initial state', () => {
    expect(getDocuments()(store.getState())).toEqual({})
  })

  describe('Insert', () => {
    test('Default Plugin', async () => {
      store.dispatch(S.insert({ id: '0' }))
      await waitUntil(() =>
        R.any(action => action.type === pureInsert.type, store.getActions())
      )
      const doc = S.getDocument('0')(store.getState())
      if (!doc) throw new Error('Document not found')
      expect(doc.plugin).toEqual('text')
    })

    test('Stateful plugin w/ state', async () => {
      store.dispatch(
        S.insert({
          id: '0',
          plugin: 'stateful',
          state: { counter: 0 }
        })
      )
      await waitUntil(() =>
        R.any(action => action.type === pureInsert.type, store.getActions())
      )
      expect(S.getDocument('0')(store.getState())).toEqual({
        plugin: 'stateful',
        state: { counter: 0 }
      })
    })
  })

  describe('Remove', () => {
    test('One document', async () => {
      store.dispatch(
        S.insert({
          id: '1',
          plugin: 'stateful',
          state: { counter: 0 }
        })
      )
      await waitUntil(() =>
        R.any(action => action.type === pureInsert.type, store.getActions())
      )
      store.dispatch(S.remove('1'))
      expect(getDocuments()(store.getState())).toEqual({})
    })
    test('Two documents', async () => {
      store.dispatch(
        S.insert({
          id: '1',
          plugin: 'stateful',
          state: { counter: 0 }
        })
      )
      store.dispatch(
        S.insert({
          id: '2',
          plugin: 'stateful',
          state: { counter: 0 }
        })
      )
      await waitUntil(
        () =>
          R.filter(
            action => action.type === pureInsert.type,
            store.getActions()
          ).length >= 2
      )
      store.dispatch(S.remove('1'))
      expect(getDocuments()(store.getState())).toEqual({
        2: {
          plugin: 'stateful',
          state: { counter: 0 }
        }
      })
    })
    test('Non-existing document', async () => {
      store.dispatch(
        S.insert({
          id: '1',
          plugin: 'stateful',
          state: { counter: 0 }
        })
      )
      await waitUntil(() =>
        R.any(action => action.type === pureInsert.type, store.getActions())
      )
      store.dispatch(S.remove('2'))
      expect(R.values(getDocuments()(store.getState()))).toHaveLength(1)
    })
  })

  describe('Change', () => {
    test('Whole state', async () => {
      store.dispatch(
        S.insert({
          id: '1',
          plugin: 'stateful',
          state: 0
        })
      )
      await waitUntil(() =>
        R.any(action => action.type === pureInsert.type, store.getActions())
      )
      store.dispatch(
        S.change({
          id: '1',
          state: { initial: () => 1 }
        })
      )
      await waitUntil(() =>
        R.any(action => action.type === pureChange.type, store.getActions())
      )
      expect(S.getDocument('1')(store.getState())).toEqual({
        plugin: 'stateful',
        state: 1
      })
    })
  })

  describe('Replace', () => {
    test('Whole state', async () => {
      store.dispatch(
        S.insert({
          id: '1',
          plugin: 'stateful',
          state: 0
        })
      )
      await waitUntil(() =>
        R.any(action => action.type === pureInsert.type, store.getActions())
      )
      store.dispatch(
        S.replace({
          id: '1',
          document: id => {
            return {
              plugin: 'blockquote',
              state: id
            }
          }
        })
      )
      await waitUntil(() =>
        R.any(action => action.type === pureReplace.type, store.getActions())
      )
      expect(S.serializeDocument('1')(store.getState())).toEqual({
        plugin: 'blockquote',
        state: {
          plugin: 'stateful',
          state: 0
        }
      })
    })
  })
})
