import { plugins } from '../../__fixtures__/plugins'
import { createStore, getClipboard, copy } from '../../src/redux-store'

let store: ReturnType<typeof createStore>['store']

beforeEach(() => {
  store = createStore({
    plugins,
    defaultPlugin: 'text'
  }).store
})

describe('Clipboard', () => {
  test('Initial state', () => {
    expect(getClipboard(store.getState())).toEqual([])
  })

  describe('Copy', () => {
    test('First copy', () => {
      store.dispatch(copy({ plugin: 'stateful', state: 0 }))
      expect(getClipboard(store.getState())).toHaveLength(1)
      expect(getClipboard(store.getState())[0]).toEqual({
        plugin: 'stateful',
        state: 0
      })
    })

    test('Second copy', () => {
      store.dispatch(copy({ plugin: 'stateful', state: 0 }))
      store.dispatch(copy({ plugin: 'stateful', state: 1 }))
      expect(getClipboard(store.getState())).toHaveLength(2)
      expect(getClipboard(store.getState())[0]).toEqual({
        plugin: 'stateful',
        state: 1
      })
    })

    test('Third copy', () => {
      store.dispatch(copy({ plugin: 'stateful', state: 0 }))
      store.dispatch(copy({ plugin: 'stateful', state: 1 }))
      store.dispatch(copy({ plugin: 'stateful', state: 2 }))
      expect(getClipboard(store.getState())[0]).toEqual({
        plugin: 'stateful',
        state: 2
      })
      expect(getClipboard(store.getState())).toHaveLength(3)
    })

    test('Fourth copy', () => {
      store.dispatch(copy({ plugin: 'stateful', state: 0 }))
      store.dispatch(copy({ plugin: 'stateful', state: 1 }))
      store.dispatch(copy({ plugin: 'stateful', state: 2 }))
      store.dispatch(copy({ plugin: 'stateful', state: 3 }))
      expect(getClipboard(store.getState())).toHaveLength(3)
      expect(getClipboard(store.getState())[0]).toEqual({
        plugin: 'stateful',
        state: 3
      })
    })
  })
})
