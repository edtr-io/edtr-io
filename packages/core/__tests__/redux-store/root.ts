import { plugins } from '../../__fixtures__/plugins'
import { createStore, getRoot, initRoot } from '../../src/redux-store'

let store: ReturnType<typeof createStore>['store']

beforeEach(() => {
  store = createStore({
    plugins,
    defaultPlugin: 'text'
  }).store
})

describe('Root', () => {
  test('Initial state', () => {
    expect(getRoot(store.getState())).toEqual(null)
  })

  test('Init Root', () => {
    store.dispatch(initRoot())
    expect(getRoot(store.getState())).toEqual('root')
  })
})
