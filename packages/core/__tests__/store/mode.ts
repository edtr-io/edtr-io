import { setupStore } from '../../__helpers__'
import { actions, selectors } from '../../src/store'

let store: ReturnType<typeof setupStore>

beforeEach(() => {
  store = setupStore()
})

describe('Mode', () => {
  test('Initial state', () => {
    expect(selectors.isEditable(store.getState())).toEqual(true)
  })
  test('Set editable to false', () => {
    store.dispatch(actions.setEditable(false))
    expect(selectors.isEditable(store.getState())).toEqual(false)
  })
  test('Set editable to true', () => {
    store.dispatch(actions.setEditable(true))
    expect(selectors.isEditable(store.getState())).toEqual(true)
  })
})
