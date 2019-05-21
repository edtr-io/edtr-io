import { plugins } from '../../__fixtures__/plugins'
import { createStore, isEditable, setEditable } from '../../src/redux-store'

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
