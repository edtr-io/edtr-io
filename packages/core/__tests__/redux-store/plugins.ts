import { plugins } from '../../__fixtures__/plugins'
import { createStore, getDefaultPlugin, getPlugin } from '../../src/redux-store'

let store: ReturnType<typeof createStore>['store']

beforeEach(() => {
  store = createStore({
    plugins,
    defaultPlugin: 'text'
  }).store
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
