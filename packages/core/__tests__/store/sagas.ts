import {
  ActionType,
  AsyncChangeAction,
  AsyncInsertAction,
  getDocument
} from '../../src/store'
import { createStore } from '../../src/editor'
import { plugins } from '../../__fixtures__/plugins'
import { Store } from 'redux'
import { renderDocument } from '../index'

describe('run sagas', () => {
  let store: Store

  beforeEach(() => {
    store = createStore(plugins, 'stateful', true)
    renderDocument(store)
  })

  test('asyncInsertAction', () => {
    const action: AsyncInsertAction = {
      type: ActionType.AsyncInsert,
      payload: {
        id: '0',
        plugin: 'stateful',
        state: {
          immediateState: 1,
          asyncState: new Promise(resolve =>
            setTimeout(function() {
              resolve(2)
            }, 100)
          )
        }
      }
    }
    store.dispatch(action)
    expect(getDocument(store.getState(), '0')).toEqual({
      plugin: 'stateful',
      state: 1
    })
    return new Promise(resolve =>
      setTimeout(function() {
        expect(getDocument(store.getState(), '0')).toEqual({
          plugin: 'stateful',
          state: 2
        })
        resolve(true)
      }, 200)
    )
  })

  test('asyncChangeAction', () => {
    const action: AsyncChangeAction = {
      type: ActionType.AsyncChange,
      payload: {
        id: 'root',
        state: () => ({
          immediateState: 1,
          asyncState: new Promise(resolve =>
            setTimeout(function() {
              resolve(2)
            }, 100)
          )
        })
      }
    }
    store.dispatch(action)
    expect(getDocument(store.getState(), 'root')).toEqual({
      plugin: 'stateful',
      state: 1
    })
    return new Promise(resolve =>
      setTimeout(function() {
        expect(getDocument(store.getState(), 'root')).toEqual({
          plugin: 'stateful',
          state: 2
        })
        resolve(true)
      }, 200)
    )
  })
})
