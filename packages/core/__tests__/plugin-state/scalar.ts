import {
  boolean,
  number,
  scalar,
  serializedScalar,
  StateDescriptor,
  StoreDeserializeHelpers,
  string
} from '../../src/plugin-state'
import { AsyncState } from '../../src/plugin'

const deserializeHelpers = {
  createDocument: () => {}
}
const serializeHelpers = {
  getDocument: () => null
}

describe('scalar', () => {
  test('initial', () => {
    const state = scalar(0)

    expect(state.createInitialState(deserializeHelpers).immediateState).toEqual(
      0
    )
  })

  test('deserialize', () => {
    const state = scalar(0)

    expect(state.deserialize(1, deserializeHelpers).immediateState).toEqual(1)
  })
})

describe('serialized scalar', () => {
  interface T {
    value: number
  }
  const serializer = {
    deserialize(serialized: string) {
      return JSON.parse(serialized)
    },
    serialize(deserialized: unknown) {
      return JSON.stringify(deserialized)
    }
  }
  let state: StateDescriptor<
    string,
    T,
    {
      (): T
      value: T
      set(updater: (oldValue: T) => T): void
    }
  >

  beforeEach(() => {
    state = serializedScalar({ value: 0 }, serializer)
  })

  test('initial', () => {
    expect(state.createInitialState(deserializeHelpers).immediateState).toEqual(
      { value: 0 }
    )
  })

  test('deserialize', () => {
    expect(
      state.deserialize('{"value":1}', deserializeHelpers).immediateState
    ).toEqual({
      value: 1
    })
  })

  test('serialize', () => {
    expect(state.serialize({ value: 1 }, serializeHelpers)).toEqual(
      '{"value":1}'
    )
  })

  test('return type', () => {
    const initial = { value: 0 }
    const scalarValue = state(initial, () => {})
    expect(scalarValue()).toEqual(initial)
    expect(scalarValue.value).toEqual(initial)
  })

  test('return type, set', () => {
    const initial = { value: 0 }
    let store = initial
    const onChange = (
      updater: (oldValue: T, helpers: StoreDeserializeHelpers) => AsyncState<T>
    ) => {
      store = updater(store, deserializeHelpers).immediateState
    }
    const scalarValue = state(initial, onChange)

    scalarValue.set(() => ({ value: 1 }))
    expect(store).toEqual({ value: 1 })
  })
})

describe('boolean', () => {
  test('default initial value', () => {
    const state = boolean()
    expect(state.createInitialState(deserializeHelpers).immediateState).toEqual(
      false
    )
  })

  test('initial value', () => {
    const state = boolean(true)
    expect(state.createInitialState(deserializeHelpers).immediateState).toEqual(
      true
    )
  })

  test('return type', () => {
    const state = boolean(false)
    const booleanValue = state(true, () => {})
    expect(booleanValue()).toEqual(true)
    expect(booleanValue.value).toEqual(true)
  })

  test('set', () => {
    const initial = false
    const state = boolean(initial)
    let store = initial
    const onChange = (
      updater: (
        oldValue: boolean,
        helpers: StoreDeserializeHelpers
      ) => AsyncState<boolean>
    ) => {
      store = updater(store, deserializeHelpers).immediateState
    }

    const booleanValue = state(initial, onChange)
    booleanValue.set(() => true)
    expect(store).toEqual(true)
    expect(store).toEqual(true)
  })
})

describe('number', () => {
  test('default initial value', () => {
    const state = number()
    expect(state.createInitialState(deserializeHelpers).immediateState).toEqual(
      0
    )
  })
  test('initial value', () => {
    const state = number(1)
    expect(state.createInitialState(deserializeHelpers).immediateState).toEqual(
      1
    )
  })
})

describe('string', () => {
  test('default initial value', () => {
    const state = string()
    expect(state.createInitialState(deserializeHelpers).immediateState).toEqual(
      ''
    )
  })
  test('initial value', () => {
    const state = string('foobar')
    expect(state.createInitialState(deserializeHelpers).immediateState).toEqual(
      'foobar'
    )
  })
})
