import { plugins } from '../../__fixtures__/plugins'
import { createStore, getFocused, focus } from '../../src/redux-store'

let store: ReturnType<typeof createStore>['store']

beforeEach(() => {
  store = createStore({
    plugins,
    defaultPlugin: 'text'
  }).store
})

describe('Focus', () => {
  test('Initial state', () => {
    expect(getFocused(store.getState())).toEqual(null)
  })

  test('Focus', () => {
    store.dispatch(focus('1'))
    expect(getFocused(store.getState())).toEqual('1')
  })

  test.todo('FocusNext')
  test.todo('FocusPrevious')
})
