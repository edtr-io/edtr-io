import { setupStore } from '../../__helpers__'
import { isEditable, setEditable } from '../../src/redux-store'

let store: ReturnType<typeof setupStore>

beforeEach(() => {
  store = setupStore()
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
