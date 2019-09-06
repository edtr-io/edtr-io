import { child, number, object, StoreDeserializeHelpers } from '../src'

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
    const objectValue = state(initial, () => {})
    expect(objectValue().foo()).toEqual(initial.foo)
    expect(typeof objectValue().foo.render).toEqual('function')
    expect(objectValue.foo()).toEqual(initial.foo)
    expect(typeof objectValue.foo.render).toEqual('function')
    expect(objectValue.counter()).toEqual(initial.counter)
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(typeof objectValue.counter.set).toEqual('function')
  })

  test('store', () => {
    const state = object({
      foo: child(),
      counter: number()
    })
    const initial = {
      foo: 'foo',
      counter: 5
    }

    let store = initial
    const onChange = (
      updater: (
        oldValue: typeof initial,
        helpers: StoreDeserializeHelpers
      ) => typeof initial
    ) => {
      store = updater(store, helpers)
    }

    const objValue = state(initial, onChange)
    objValue.counter.set(() => 1)
    expect(store).toEqual({
      foo: 'foo',
      counter: 1
    })
  })
})
