import * as R from 'ramda'

import { setupStore, waitUntil } from '../__helpers__'
import * as S from '../src'

let store: ReturnType<typeof setupStore>

beforeEach(() => {
  store = setupStore()
})

test('Initial state', () => {
  expect(S.getDocuments()(store.getState())).toEqual({})
})

describe('Insert', () => {
  test('Default Plugin', async () => {
    store.dispatch(S.insert({ id: '0' }))
    await waitUntil(() =>
      R.any(action => action.type === S.pureInsert.type, store.getActions())
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
      R.any(action => action.type === S.pureInsert.type, store.getActions())
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
      R.any(action => action.type === S.pureInsert.type, store.getActions())
    )
    store.dispatch(S.remove('1'))
    expect(S.getDocuments()(store.getState())).toEqual({})
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
          action => action.type === S.pureInsert.type,
          store.getActions()
        ).length >= 2
    )
    store.dispatch(S.remove('1'))
    expect(S.getDocuments()(store.getState())).toEqual({
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
      R.any(action => action.type === S.pureInsert.type, store.getActions())
    )
    store.dispatch(S.remove('2'))
    expect(R.values(S.getDocuments()(store.getState()))).toHaveLength(1)
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
      R.any(action => action.type === S.pureInsert.type, store.getActions())
    )
    store.dispatch(
      S.change({
        id: '1',
        state: { initial: () => 1 }
      })
    )
    await waitUntil(() =>
      R.any(action => action.type === S.pureChange.type, store.getActions())
    )
    expect(S.getDocument('1')(store.getState())).toEqual({
      plugin: 'stateful',
      state: 1
    })
  })
})

test('Wrap', async () => {
  store.dispatch(
    S.insert({
      id: '1',
      plugin: 'stateful',
      state: 0
    })
  )
  await waitUntil(() =>
    R.any(action => action.type === S.pureInsert.type, store.getActions())
  )
  store.dispatch(
    S.wrap({
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
    R.any(action => action.type === S.pureWrap.type, store.getActions())
  )
  expect(S.serializeDocument('1')(store.getState())).toEqual({
    plugin: 'blockquote',
    state: {
      plugin: 'stateful',
      state: 0
    }
  })
})

test('Unwrap', async () => {
  store.dispatch(
    S.insert({
      id: '2',
      plugin: 'stateful',
      state: 0
    })
  )
  store.dispatch(
    S.insert({
      id: '1',
      plugin: 'blockquote',
      state: '2'
    })
  )
  await waitUntil(
    () =>
      R.filter(action => action.type === S.pureInsert.type, store.getActions())
        .length >= 2
  )
  store.dispatch(
    S.unwrap({
      id: '1',
      oldId: '2'
    })
  )
  await waitUntil(() =>
    R.any(action => action.type === S.pureUnwrap.type, store.getActions())
  )
  expect(S.serializeDocument('1')(store.getState())).toEqual({
    plugin: 'stateful',
    state: 0
  })
})

test('Replace', async () => {
  store.dispatch(
    S.insert({
      id: '1',
      plugin: 'stateful',
      state: 0
    })
  )
  await waitUntil(() =>
    R.any(action => action.type === S.pureInsert.type, store.getActions())
  )
  store.dispatch(
    S.replace({
      id: '1',
      plugin: 'stateful',
      state: 5
    })
  )
  await waitUntil(() =>
    R.any(action => action.type === S.pureReplace.type, store.getActions())
  )
  expect(S.serializeDocument('1')(store.getState())).toEqual({
    plugin: 'stateful',
    state: 5
  })
})
