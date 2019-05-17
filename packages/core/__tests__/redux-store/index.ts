import { plugins } from '../../__fixtures__/plugins'
import { createStore } from '../../src/redux-store/store'
import {
  getDefaultPlugin,
  getPlugin,
  getDocuments,
  getFocused,
  isEditable
} from '../../src/redux-store/reducer'
import { setEditable } from '../../src/redux-store/actions'

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
})

describe('Focus', () => {
  test('Initial state', () => {
    expect(getFocused(store.getState())).toBeNull()
  })
})
