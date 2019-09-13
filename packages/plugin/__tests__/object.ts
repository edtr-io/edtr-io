import {
  legacyChild,
  legacyNumber,
  newObject,
  serializedScalar,
  object,
  StoreDeserializeHelpers
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
      foo: legacyChild(),
      counter: legacyNumber()
    })
    const initial = state.createInitialState(helpers)

    expect(initial.counter).toEqual(0)
    expect(typeof initial.foo).toEqual('string')
    expect(helpers.createDocument).toHaveBeenCalledTimes(1)
  })

  test('initial with 2 children', () => {
    const state = object({
      foo: legacyChild(),
      bar: legacyChild()
    })
    const initial = state.createInitialState(helpers)

    expect(typeof initial.foo).toEqual('string')
    expect(typeof initial.bar).toEqual('string')
    expect(helpers.createDocument).toHaveBeenCalledTimes(2)
    expect(initial.foo).not.toEqual(initial.bar)
  })

  test('deserialize', () => {
    const state = object({
      foo: legacyChild(),
      counter: legacyNumber()
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
      foo: legacyChild(),
      bar: legacyChild(),
      counter: legacyNumber()
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
      foo: legacyChild(),
      counter: legacyNumber()
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
      foo: legacyChild(),
      counter: legacyNumber()
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

describe('new object', () => {
  let helpers: StoreDeserializeHelpers<string, number> & {
    createDocument: jest.Mock
  }
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

  beforeEach(() => {
    helpers = {
      createDocument: jest.fn()
    }
  })

  test('initial with serialized child', () => {
    const state = newObject({
      foo: serializedScalar({ value: 0 }, serializer)
    })
    const initial = state.createInitialState(helpers)
    expect(initial.foo).toEqual({ value: 0 })
  })

  test('deserialize', () => {
    const state = newObject({
      foo: serializedScalar({ value: 0 }, serializer)
    })

    const serialized = {
      foo: '{"value":5}'
    }

    const deserialized = state.deserialize(serialized, helpers)
    expect(deserialized.foo.value).toEqual(5)
  })

  test('serialize', () => {
    const state = newObject({
      foo: serializedScalar({ value: 0 }, serializer)
    })
    const deserialized = {
      foo: { value: 5 }
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
      foo: '{"value":5}'
    })
  })

  test('return type', () => {
    const state = newObject({
      foo: serializedScalar({ value: 0 }, serializer)
    })
    const initial = {
      foo: { value: 5 }
    }
    const objectValue = new state(initial, () => {})
    expect(objectValue.foo.value).toEqual(initial.foo)
    expect(typeof objectValue.foo.set).toEqual('function')
  })

  test('store', () => {
    const state = newObject({
      foo: serializedScalar({ value: 0 }, serializer)
    })
    const initial = {
      foo: { value: 5 }
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

    const objValue = new state(initial, onChange)
    objValue.foo.set(state => {
      return { value: state.value + 1 }
    })
    expect(store).toEqual({
      foo: {
        value: 6
      }
    })
  })
})
