import { getDefaultPlugin, getPlugin } from '../../src/store'
import { setupStore } from '../../__helpers__'

let store: ReturnType<typeof setupStore>

beforeEach(() => {
  store = setupStore()
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
