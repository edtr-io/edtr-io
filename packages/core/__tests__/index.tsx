import { createStateReducer, EditorState, StateActionType } from '../src'

let reducer: ReturnType<typeof createStateReducer>
let state: EditorState

beforeEach(() => {
  reducer = createStateReducer({
    defaultPlugin: 'default',
    generateId() {
      return '0'
    }
  })
  state = reducer()
})

test('empty state', () => {
  expect(state).toEqual({})
})

test('insert', () => {
  state = reducer(state, { type: StateActionType.Insert, payload: 'text' })
  expect(state[0]).toEqual({ type: 'text' })
})

test('insert default plugin', () => {
  state = reducer(state, { type: StateActionType.Insert })
  expect(state[0]).toEqual({ type: 'default' })
})
