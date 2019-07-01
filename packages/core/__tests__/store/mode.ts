import { scopeActions, setupStore } from '../../__helpers__'
import { selectors } from '../../src/store'

let store: ReturnType<typeof setupStore>
const scopedActions = scopeActions()

beforeEach(() => {
  store = setupStore()
})

describe('Mode', () => {
  test('Initial state', () => {
    expect(selectors.isEditable(store.getState())).toEqual(true)
  })
  test('Set editable to false', () => {
    store.dispatch(scopedActions.setEditable(false))
    expect(selectors.isEditable(store.getState())).toEqual(false)
  })
  test('Set editable to true', () => {
    store.dispatch(scopedActions.setEditable(true))
    expect(selectors.isEditable(store.getState())).toEqual(true)
  })
})
