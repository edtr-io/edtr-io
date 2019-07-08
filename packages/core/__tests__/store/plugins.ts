import { setupStore } from '../../__helpers__'
import { selectors } from '../../src'

let store: ReturnType<typeof setupStore>

beforeEach(() => {
  store = setupStore()
})

describe('Plugins', () => {
  describe('Default plugin', () => {
    test('Initial state', () => {
      expect(selectors.getDefaultPlugin(store.getState())).toEqual('text')
    })
  })
  describe('Plugins', () => {
    test('Existing plugins', () => {
      expect(selectors.getPlugin(store.getState(), 'text')).toBeDefined()
    })
    test('Non-existing plugin', () => {
      expect(selectors.getPlugin(store.getState(), 'foobar')).toBeNull()
    })
  })
})
