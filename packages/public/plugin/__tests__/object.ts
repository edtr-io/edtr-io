import {
  child,
  number,
  object,
  StoreDeserializeHelpers,
  StateUpdater,
  list,
  StateExecutor
} from '../src'

describe('object', () => {
  let helpers: StoreDeserializeHelpers<string, number> & {
    createDocument: jest.Mock
  }

  beforeEach(() => {
    helpers = {
      createDocument: jest.fn()
    }
  })

  test('initial with child', () => {
    const state = object({
      foo: child(),
      counter: number()
    })
    const initial = state.createInitialState(helpers)

    expect(initial.counter).toEqual(0)
    expect(typeof initial.foo).toEqual('string')
    expect(helpers.createDocument).toHaveBeenCalledTimes(1)
  })

  test('initial with 2 children', () => {
    const state = object({
      foo: child(),
      bar: child()
    })
    const initial = state.createInitialState(helpers)

    expect(typeof initial.foo).toEqual('string')
    expect(typeof initial.bar).toEqual('string')
    expect(helpers.createDocument).toHaveBeenCalledTimes(2)
    expect(initial.foo).not.toEqual(initial.bar)
  })

  test('deserialize', () => {
    const state = object({
      foo: child(),
      counter: number()
    })

    const serialized = {
      foo: { plugin: 'text', state: 'foobar' },
      counter: 5
    }

    const deserialized = state.deserialize(serialized, helpers)
    expect(typeof deserialized.foo).toEqual('string')
    expect(deserialized.counter).toEqual(5)
    expect(helpers.createDocument).toHaveBeenCalledTimes(1)
    expect(helpers.createDocument.mock.calls[0][0].state).toEqual('foobar')
  })

  test('serialize', () => {
    const state = object({
      foo: child(),
      bar: child(),
      counter: number()
    })
    const deserialized = {
      foo: 'foo',
      bar: 'bar',
      counter: 5
    }
    expect(
      state.serialize(deserialized, {
        getDocument(id: string) {
          return {
            plugin: 'counter',
            state: id === 'foo' ? 0 : 1
          }
        }
      })
    ).toEqual({
      foo: { plugin: 'counter', state: 0 },
      bar: { plugin: 'counter', state: 1 },
      counter: 5
    })
  })

  test('return type', () => {
    const state = object({
      foo: child(),
      counter: number()
    })
    const initial = {
      foo: 'foo',
      counter: 5
    }
    const objectValue = state.init(initial, () => {})
    expect(typeof objectValue.foo.render).toEqual('function')
    expect(objectValue.foo.id).toBeDefined()
    expect(typeof objectValue.foo.render).toEqual('function')
    expect(objectValue.counter.value).toEqual(initial.counter)
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(typeof objectValue.counter.set).toEqual('function')
  })

  test('store', () => {
    const state = object({
      foo: child(),
      counter: number()
    })
    const initialState = {
      foo: 'foo',
      counter: 5
    }

    let store = initialState
    const onChange = (initial: StateUpdater<typeof initialState>) => {
      store = initial(store, helpers)
    }

    const objValue = state.init(initialState, onChange)
    objValue.counter.set(value => value + 1)
    expect(store).toEqual({
      foo: 'foo',
      counter: 6
    })
  })

  test('innerOnChange correctly dispatches changes', () => {
    const state = object({
      foo: list(child(), 0)
    })
    const initialState = state.createInitialState(helpers)
    expect(helpers.createDocument).not.toHaveBeenCalled()

    let store = initialState
    const onChange = (
      initial: StateUpdater<typeof initialState>,
      executor?: StateExecutor<StateUpdater<typeof initialState>>
    ) => {
      store = initial(store, helpers)
      if (executor) {
        executor(
          resolveUpdater => {
            store = resolveUpdater(store, helpers)
          },
          rejectUpdater => {
            store = rejectUpdater(store, helpers)
          },
          nextUpdater => {
            store = nextUpdater(store, helpers)
          }
        )
      }
    }

    const objValue = state.init(initialState, onChange)
    objValue.foo.insert()
    expect(store.foo.length).toEqual(1)
    expect(helpers.createDocument).toHaveBeenCalledTimes(1)
  })

  test('get focusable children', () => {
    const state = object({
      foo: child(),
      counter: number()
    })
    const initialState = {
      foo: 'foo',
      counter: 5
    }

    expect(state.getFocusableChildren(initialState)).toEqual([{ id: 'foo' }])
  })
})
