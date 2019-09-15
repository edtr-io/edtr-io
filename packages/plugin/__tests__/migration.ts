import { migratable, number, object } from '../src'

const deserializeHelpers = {
  createDocument: () => {}
}
const serializeHelpers = {
  getDocument: () => null
}

describe('migration', () => {
  const state0 = number(0)
  const state1 = object({
    value: number(0)
  })
  const state2 = object({
    value: number(0),
    by: number(1)
  })

  const state = migratable(state0)
    .migrate(state1, s => {
      return { value: s }
    })
    .migrate(state2, s => {
      return {
        ...s,
        by: 1
      }
    })

  test('initial', () => {
    expect(state.createInitialState(deserializeHelpers)).toEqual({
      value: 0,
      by: 1
    })
  })

  test('deserialize state version 0', () => {
    expect(state.deserialize(5, deserializeHelpers)).toEqual({
      value: 5,
      by: 1
    })
  })

  test('deserialize state version 1', () => {
    expect(
      state.deserialize(
        { __version__: 1, value: { value: 5 } },
        deserializeHelpers
      )
    ).toEqual({ value: 5, by: 1 })
  })

  test('deserialize state version 2', () => {
    expect(
      state.deserialize(
        { __version__: 2, value: { value: 5, by: 1 } },
        deserializeHelpers
      )
    ).toEqual({ value: 5, by: 1 })
  })

  test('serialize', () => {
    expect(state.serialize({ value: 3, by: -1 }, serializeHelpers)).toEqual({
      __version__: 2,
      value: { value: 3, by: -1 }
    })
  })

  test('return type', () => {
    const initial = { value: 3, by: -1 }
    const value = state.init(initial, () => {})
    expect(value.value.get()).toEqual(3)
  })
})
