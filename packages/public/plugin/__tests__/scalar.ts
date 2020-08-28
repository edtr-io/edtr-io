import {
  boolean,
  number,
  scalar,
  serializedScalar,
  string,
  Serializer,
  StateUpdater,
} from '../src'

const deserializeHelpers = {
  createDocument: () => {},
}
const serializeHelpers = {
  getDocument: () => null,
}

describe('scalar', () => {
  test('initial', () => {
    const state = scalar(0)
    expect(state.createInitialState(deserializeHelpers)).toEqual(0)
  })

  test('deserialize', () => {
    const state = scalar(0)
    expect(state.deserialize(1, deserializeHelpers)).toEqual(1)
  })

  test('get focusable children', () => {
    const state = scalar(0)
    expect(state.getFocusableChildren(1)).toEqual([])
  })
})

describe('serialized scalar', () => {
  interface T {
    value: number
  }
  const serializer: Serializer<string, T> = {
    deserialize(serialized) {
      return JSON.parse(serialized) as T
    },
    serialize(deserialized) {
      return JSON.stringify(deserialized)
    },
  }

  test('initial', () => {
    const state = serializedScalar({ value: 0 }, serializer)
    expect(state.createInitialState(deserializeHelpers)).toEqual({ value: 0 })
  })

  test('deserialize', () => {
    const state = serializedScalar({ value: 0 }, serializer)
    expect(state.deserialize('{"value":1}', deserializeHelpers)).toEqual({
      value: 1,
    })
  })

  test('serialize', () => {
    const state = serializedScalar({ value: 0 }, serializer)
    expect(state.serialize({ value: 1 }, serializeHelpers)).toEqual(
      '{"value":1}'
    )
  })

  test('return type, value getter', () => {
    const state = serializedScalar({ value: 0 }, serializer)
    const initial = { value: 0 }
    const scalarValue = state.init(initial, () => {})
    expect(scalarValue.value).toEqual(initial)
  })

  test('return type, get', () => {
    const state = serializedScalar({ value: 0 }, serializer)
    const initial = { value: 0 }
    const scalarValue = state.init(initial, () => {})
    expect(scalarValue.get()).toEqual(initial)
  })

  test('return type, value setter', () => {
    const state = serializedScalar({ value: 0 }, serializer)
    const initialState = { value: 0 }
    let store = initialState
    const onChange = (initial: StateUpdater<T>) => {
      store = initial(store, deserializeHelpers)
    }
    const scalarValue = state.init(initialState, onChange)

    scalarValue.value = { value: 1 }
    expect(store).toEqual({ value: 1 })
  })

  test('return type, set (value)', () => {
    const state = serializedScalar({ value: 0 }, serializer)
    const initialState = { value: 0 }
    let store = initialState
    const onChange = (initial: StateUpdater<T>) => {
      store = initial(store, deserializeHelpers)
    }
    const scalarValue = state.init(initialState, onChange)

    scalarValue.set({ value: 1 })
    expect(store).toEqual({ value: 1 })
  })

  test('return type, set (updater)', () => {
    const state = serializedScalar({ value: 0 }, serializer)
    const initialState = { value: 0 }
    let store = initialState
    const onChange = (initial: StateUpdater<T>) => {
      store = initial(store, deserializeHelpers)
    }
    const scalarValue = state.init(initialState, onChange)

    scalarValue.set(({ value }) => {
      return { value: value + 1 }
    })
    expect(store).toEqual({ value: 1 })
  })

  test('get focusable children', () => {
    const state = serializedScalar({ value: 0 }, serializer)
    const initial = { value: 0 }
    expect(state.getFocusableChildren(initial)).toEqual([])
  })
})

describe('boolean', () => {
  test('default initial value', () => {
    const state = boolean()
    expect(state.createInitialState(deserializeHelpers)).toEqual(false)
  })

  test('initial value', () => {
    const state = boolean(true)
    expect(state.createInitialState(deserializeHelpers)).toEqual(true)
  })

  test('return type, value getter', () => {
    const state = boolean(false)
    const booleanValue = state.init(true, () => {})
    expect(booleanValue.value).toEqual(true)
  })

  test('return type, get', () => {
    const state = boolean(false)
    const booleanValue = state.init(true, () => {})
    expect(booleanValue.get()).toEqual(true)
  })

  test('return type, value setter', () => {
    const initialState = false
    const state = boolean(initialState)
    let store = initialState
    const onChange = (initial: StateUpdater<boolean>) => {
      store = initial(store, deserializeHelpers)
    }
    const booleanValue = state.init(initialState, onChange)
    booleanValue.value = true
    expect(store).toEqual(true)
  })

  test('return type, value set (value)', () => {
    const initialState = false
    const state = boolean(initialState)
    let store = initialState
    const onChange = (initial: StateUpdater<boolean>) => {
      store = initial(store, deserializeHelpers)
    }

    const booleanValue = state.init(initialState, onChange)
    booleanValue.set(true)
    expect(store).toEqual(true)
  })

  test('return type, value set (updater)', () => {
    const initialState = false
    const state = boolean(initialState)
    let store = initialState
    const onChange = (initial: StateUpdater<boolean>) => {
      store = initial(store, deserializeHelpers)
    }

    const booleanValue = state.init(initialState, onChange)
    booleanValue.set((value) => !value)
    expect(store).toEqual(true)
  })
})

describe('number', () => {
  test('default initial value', () => {
    const state = number()
    expect(state.createInitialState(deserializeHelpers)).toEqual(0)
  })
  test('initial value', () => {
    const state = number(1)
    expect(state.createInitialState(deserializeHelpers)).toEqual(1)
  })
})

describe('string', () => {
  test('default initial value', () => {
    const state = string()
    expect(state.createInitialState(deserializeHelpers)).toEqual('')
  })
  test('initial value', () => {
    const state = string('foobar')
    expect(state.createInitialState(deserializeHelpers)).toEqual('foobar')
  })
})
