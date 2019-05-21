import { setupStore } from '../../__helpers__'
import { getFocused, focus } from '../../src/redux-store'

let store: ReturnType<typeof setupStore>

beforeEach(() => {
  store = setupStore()
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
