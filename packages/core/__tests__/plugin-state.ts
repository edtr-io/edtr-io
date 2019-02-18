import { StateType } from '../src'

describe('scalar', () => {
  test('initial value', () => {
    const getState = createMockStateDescriptor(
      StateType.scalar({ foo: 'initial' })
    )
    expect(getState().value).toEqual({ foo: 'initial' })
  })

  test('value change', () => {
    const getState = createMockStateDescriptor(
      StateType.scalar({ foo: 'initial' })
    )
    getState.act(() => {
      getState().set({ foo: 'bar' })
    })
    expect(getState().value).toEqual({ foo: 'bar' })
  })

  test('may pass update function to onChange', done => {
    const getState = createMockStateDescriptor(
      StateType.scalar({ foo: 'initial' })
    )
    getState.act(() => {
      getState().set(currentState => {
        expect(currentState).toEqual({ foo: 'initial' })
        done()
        return currentState
      })
    })
  })
})

describe('boolean', () => {
  test('default initial value', () => {
    const getState = createMockStateDescriptor(StateType.boolean())
    expect(getState().value).toEqual(false)
  })

  test('initial value', () => {
    const getState = createMockStateDescriptor(StateType.boolean(true))
    expect(getState().value).toEqual(true)
  })

  test('value change', () => {
    const getState = createMockStateDescriptor(StateType.boolean())
    expect(getState().value).toEqual(false)
    getState.act(() => {
      getState().set(true)
    })
    expect(getState().value).toEqual(true)
  })
})

describe('child', () => {
  test('default initial value', () => {
    const getState = createMockStateDescriptor(StateType.child())
    expect(getState().value.id).toBeDefined()
  })

  test('initial value', () => {
    const getState = createMockStateDescriptor(
      StateType.child({ plugin: 'foo' })
    )
    expect(getState().value.plugin).toEqual('foo')
  })
})

describe('list', () => {
  test('default initial count', () => {
    const getState = createMockStateDescriptor(
      StateType.list(StateType.boolean(false))
    )
    expect(getState().items).toEqual([])
  })

  test('initial count', () => {
    const getState = createMockStateDescriptor(
      StateType.list(StateType.boolean(false), 1)
    )
    expect(getState().items[0].value).toEqual(false)
  })

  test('update', () => {
    const getState = createMockStateDescriptor(
      StateType.list(StateType.boolean(false), 1)
    )
    getState.act(() => {
      getState().items[0].set(true)
    })
    expect(getState().items[0].value).toEqual(true)
  })

  test('insert', () => {
    const getState = createMockStateDescriptor(
      StateType.list(StateType.boolean(false), 1)
    )
    getState.act(() => {
      getState().insert(0)
    })
    expect(getState().items.length).toEqual(2)
    expect(getState().items[0].value).toEqual(false)
  })

  test('remove', () => {
    const getState = createMockStateDescriptor(
      StateType.list(StateType.boolean(false), 1)
    )
    getState.act(() => {
      getState().remove(0)
    })
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
    )
    expect(getState().isCorrect.value).toEqual(false)
    expect(getState().content).toBeDefined()
  })

  test('update', () => {
    const getState = createMockStateDescriptor(
      StateType.object({
        isCorrect: StateType.boolean(false),
        content: StateType.child()
      })
    )
    getState.act(() => {
      getState().isCorrect.set(true)
    })
    expect(getState().isCorrect.value).toEqual(true)
  })
})

function createMockStateDescriptor<T, R>(
  type: (...args: StateType.PluginStateParameters<T>) => R
): MockStateDescriptor<T, R> {
  const container = createStateContainer<T>()
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

interface MockStateDescriptor<T, R> {
  (): R
  act(f: () => void): void
}

function createStateContainer<T>() {
  let state: T | undefined
  const onChange = (param: T | ((currentRawState: T | undefined) => T)) => {
    let value: T
    if (typeof param === 'function') {
      const f = param as ((currentValue: T | undefined) => T)
      value = f(state)
    } else {
      value = param
    }
    state = value
  }

  return {
    get(): StateType.PluginStateParameters<T> {
      return [state, onChange]
    },
    reset() {
      state = undefined
    }
  }
}
