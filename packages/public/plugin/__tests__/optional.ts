import { number, Optional, optional, StateUpdater } from '../src'

const deserializeHelpers = {
  createDocument: () => {}
}
const serializeHelpers = {
  getDocument: () => null
}

describe('optional', () => {
  // interface T {
  //   value: number
  // }
  // const serializer: Serializer<string, T> = {
  //   deserialize(serialized) {
  //     return JSON.parse(serialized)
  //   },
  //   serialize(deserialized) {
  //     return JSON.stringify(deserialized)
  //   }
  // }
  test('initial (initially null)', () => {
    const state = optional(number(5))
    expect(state.createInitialState(deserializeHelpers)).toEqual({
      defined: false,
      value: null
    })
  })

  test('initial (initially defined)', () => {
    const state = optional(number(5), true)
    expect(state.createInitialState(deserializeHelpers)).toEqual({
      defined: true,
      value: 5
    })
  })

  test('deserialize (not defined)', () => {
    const state = optional(number(5))
    expect(state.deserialize(undefined, deserializeHelpers)).toEqual({
      defined: false,
      value: null
    })
  })

  test('deserialize (defined)', () => {
    const state = optional(number(5))
    expect(state.deserialize(3, deserializeHelpers)).toEqual({
      defined: true,
      value: 3
    })
  })

  test('serialize (not defined)', () => {
    const state = optional(number(5))
    expect(
      state.serialize({ defined: false, value: null }, serializeHelpers)
    ).toEqual(undefined)
  })

  test('serialize (defined)', () => {
    const state = optional(number(5))
    expect(
      state.serialize({ defined: true, value: 3 }, serializeHelpers)
    ).toEqual(3)
  })

  test('return type (not defined)', () => {
    const state = optional(number(5))
    const value = state.init({ defined: false, value: null }, () => {})
    expect(value.defined).toBeFalsy()
  })

  test('return type, value getter', () => {
    const state = optional(number(5))
    const value = state.init({ defined: true, value: 3 }, () => {})
    expect(value.defined).toBeTruthy()
    if (!value.defined) return
    expect(value.value).toEqual(3)
  })

  test('return type, value setter', () => {
    const state = optional(number(5))
    const initialState: Optional<number> = { defined: true, value: 3 }
    let store: Optional<number> = initialState
    const onChange = (initial: StateUpdater<Optional<number>>) => {
      store = initial(store, deserializeHelpers)
    }
    const value = state.init(initialState, onChange)
    expect(value.defined).toBeTruthy()
    if (!value.defined) return
    value.value = 2
    expect(store).toEqual({ defined: true, value: 2 })
  })

  test('return type, create (default value)', () => {
    const state = optional(number(5))
    const initialState: Optional<number> = { defined: false, value: null }
    let store: Optional<number> = initialState
    const onChange = (initial: StateUpdater<Optional<number>>) => {
      store = initial(store, deserializeHelpers)
    }
    const value = state.init(initialState, onChange)
    expect(value.defined).toBeFalsy()
    if (value.defined) return
    value.create()
    expect(store).toEqual({ defined: true, value: 5 })
  })

  test('return type, remove', () => {
    const state = optional(number(5))
    const initialState: Optional<number> = { defined: true, value: 3 }
    let store: Optional<number> = initialState
    const onChange = (initial: StateUpdater<Optional<number>>) => {
      store = initial(store, deserializeHelpers)
    }
    const value = state.init(initialState, onChange)
    expect(value.defined).toBeTruthy()
    if (!value.defined) return
    value.remove()
    expect(store).toEqual({ defined: false, value: null })
  })
})
