import { StateType } from '../src'

describe('serialized scalar', () => {
  const serializer = {
    deserialize({ value }: { value: number }) {
      return value
    },
    serialize(value: number) {
      return { value }
    }
  }

  test('initial value', () => {
    const getState = createMockStateDescriptor(
      StateType.serializedScalar(0, serializer)
    )()
    expect(getState().$$value).toEqual({ value: 0 })
    expect(getState().value).toEqual(0)
  })

  test('persisted value', () => {
    const getState = createMockStateDescriptor(
      StateType.serializedScalar(0, serializer)
    )(1)
    expect(getState().$$value).toEqual({ value: 1 })
    expect(getState().value).toEqual(1)
  })

  test('value change', () => {
    const getState = createMockStateDescriptor(
      StateType.serializedScalar(0, serializer)
    )()
    getState.act(() => {
      getState().set(1)
    })
    expect(getState().$$value).toEqual({ value: 1 })
    expect(getState().value).toEqual(1)
  })

  test('may pass update function to onChange', () => {
    const getState = createMockStateDescriptor(
      StateType.serializedScalar(0, serializer)
    )()
    getState.act(() => {
      getState().set(value => value + 1)
    })
    expect(getState().$$value).toEqual({ value: 1 })
    expect(getState().value).toEqual(1)
  })
})

describe('scalar', () => {
  test('initial value', () => {
    const getState = createMockStateDescriptor(
      StateType.scalar({ foo: 'initial' })
    )()
    expect(getState().$$value).toEqual({ foo: 'initial' })
    expect(getState().value).toEqual({ foo: 'initial' })
  })

  test('value change', () => {
    const getState = createMockStateDescriptor(
      StateType.scalar({ foo: 'initial' })
    )()
    getState.act(() => {
      getState().set({ foo: 'bar' })
    })
    expect(getState().$$value).toEqual({ foo: 'bar' })
    expect(getState().value).toEqual({ foo: 'bar' })
  })

  test('may pass update function to onChange', () => {
    const getState = createMockStateDescriptor(
      StateType.scalar({ foo: 'initial' })
    )()
    getState.act(() => {
      getState().set(currentState => {
        return { foo: currentState.foo + ' state' }
      })
    })
    expect(getState().$$value).toEqual({ foo: 'initial state' })
    expect(getState().value).toEqual({ foo: 'initial state' })
  })
})

describe('boolean', () => {
  test('default initial value', () => {
    const getState = createMockStateDescriptor(StateType.boolean())()
    expect(getState().$$value).toEqual(false)
    expect(getState().value).toEqual(false)
  })

  test('initial value', () => {
    const getState = createMockStateDescriptor(StateType.boolean(true))()
    expect(getState().$$value).toEqual(true)
    expect(getState().value).toEqual(true)
  })

  test('value change', () => {
    const getState = createMockStateDescriptor(StateType.boolean())()
    expect(getState().value).toEqual(false)
    getState.act(() => {
      getState().set(true)
    })
    expect(getState().$$value).toEqual(true)
    expect(getState().value).toEqual(true)
  })
})

describe('child', () => {
  test('default initial value', () => {
    const getState = createMockStateDescriptor(StateType.child())()
    expect(getState().$$value.id).toBeDefined()
    expect(getState().value).toBeDefined()
  })

  test('initial value', () => {
    const getState = createMockStateDescriptor(
      StateType.child({ plugin: 'foo' })
    )()
    // expect(getState().$$value.plugin).toEqual('foo')
    expect(getState().value.plugin).toEqual('foo')
  })
})

describe('list', () => {
  test('default initial count', () => {
    const getState = createMockStateDescriptor(
      StateType.list(StateType.boolean(false))
    )()
    expect(getState().$$value).toEqual([])
    expect(getState().items).toEqual([])
  })

  test('initial count', () => {
    const getState = createMockStateDescriptor(
      StateType.list(StateType.boolean(false), 1)
    )()
    expect(getState().$$value[0].value).toEqual(false)
    expect(getState().items[0].value).toEqual(false)
  })

  test('update', () => {
    const getState = createMockStateDescriptor(
      StateType.list(StateType.boolean(false), 1)
    )()
    getState.act(() => {
      getState().items[0].set(true)
    })
    expect(getState().$$value[0].value).toEqual(true)
    expect(getState().items[0].value).toEqual(true)
  })

  test('insert', () => {
    const getState = createMockStateDescriptor(
      StateType.list(StateType.boolean(false), 1)
    )()
    getState.act(() => {
      getState().insert(0)
    })
    expect(getState().$$value.length).toEqual(2)
    expect(getState().items.length).toEqual(2)
    expect(getState().$$value[0].value).toEqual(false)
    expect(getState().items[0].value).toEqual(false)
  })
  test('external state', () => {
    const getState = createMockStateDescriptor(
      StateType.list(StateType.boolean(false), 1)
    )([true])
    expect(getState().$$value.length).toEqual(1)
    expect(getState().items.length).toEqual(1)
    expect(getState().$$value[0].value).toEqual(true)
    expect(getState().items[0].value).toEqual(true)
  })

  test('remove', () => {
    const getState = createMockStateDescriptor(
      StateType.list(StateType.boolean(false), 1)
    )()
    getState.act(() => {
      getState().remove(0)
    })
    expect(getState().$$value.length).toEqual(0)
    expect(getState().items.length).toEqual(0)
  })
})

describe('object', () => {
  test('initial value', () => {
    const getState = createMockStateDescriptor(
      StateType.object({
        isCorrect: StateType.boolean(false),
        content: StateType.child()
      })
    )()
    expect(getState().$$value.isCorrect).toEqual(false)
    expect(getState().value.isCorrect.value).toEqual(false)
    expect(getState().$$value.content).toBeDefined()
    expect(getState().value.content.value).toBeDefined()
  })

  test('update', () => {
    const getState = createMockStateDescriptor(
      StateType.object({
        isCorrect: StateType.boolean(false),
        content: StateType.child()
      })
    )()
    getState.act(() => {
      getState().value.isCorrect.set(true)
    })
    expect(getState().$$value.isCorrect).toEqual(true)
    expect(getState().value.isCorrect.value).toEqual(true)
  })
})

function createMockStateDescriptor<T, S, R>(
  type: (...args: StateType.PluginStateParameters<T, S>) => R
) {
  return function(initialValue?: T): MockStateDescriptor<T, R> {
    const container = createStateContainer<T, S>(initialValue)
    let returns: R
    update()

    return Object.assign(() => returns, {
      act(f: () => void) {
        f()
        update()
      }
    })

    function update() {
      returns = type(...container.get())
    }
  }
}

interface MockStateDescriptor<T, R> {
  (): R
  act(f: () => void): void
}

function createStateContainer<T, S>(initialValue: T | undefined) {
  let state: S | undefined
  const onChange = (param: S | ((currentRawState: S | undefined) => S)) => {
    let value: S
    if (typeof param === 'function') {
      const f = param as ((currentValue: S | undefined) => S)
      value = f(state)
    } else {
      value = param
    }
    state = value
  }

  const dispatch = () => {}

  return {
    get(): StateType.PluginStateParameters<T, S> {
      return [initialValue, state, onChange, dispatch]
    },
    reset() {
      state = undefined
    }
  }
}
