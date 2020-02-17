import {
  child,
  list,
  StoreDeserializeHelpers,
  string,
  StateUpdater,
  StateExecutor
} from '../src'

describe('list', () => {
  interface T {
    id: string
    value: string
  }

  let helpers: StoreDeserializeHelpers & { createDocument: jest.Mock }
  let store: T[]
  const onChange = (initial: StateUpdater<T[]>) => {
    store = initial(store, helpers)
  }

  beforeEach(() => {
    helpers = {
      createDocument: jest.fn()
    }
    store = []
  })

  test('initial list with 0 children', () => {
    const state = list(child({ plugin: 'counter' }))
    const initial = state.createInitialState(helpers)

    expect(initial).toEqual([])
  })

  test('initial list with one initial child', () => {
    const state = list(child({ plugin: 'counter ' }), 1)
    const initial = state.createInitialState(helpers)

    expect(initial).toHaveLength(1)
    expect(typeof initial[0].id).toEqual('string')
    expect(typeof initial[0].value).toEqual('string')
  })

  test('initial list with two initial children', () => {
    const state = list(child({ plugin: 'counter' }), 2)
    const initial = state.createInitialState(helpers)

    expect(initial).toHaveLength(2)
    expect(initial[0].id).not.toEqual(initial[1].id)
    expect(initial[0].value).not.toEqual(initial[1].value)
  })

  test('deserialize', () => {
    const state = list(child({ plugin: 'counter' }))
    const serialized = [
      { plugin: 'counter', state: 0 },
      { plugin: 'counter', state: 1 }
    ]
    const deserialized = state.deserialize(serialized, helpers)
    expect(deserialized).toHaveLength(2)
    expect(typeof deserialized[0].id).toEqual('string')
    expect(typeof deserialized[0].value).toEqual('string')
    expect(typeof deserialized[1].id).toEqual('string')
    expect(typeof deserialized[1].value).toEqual('string')
    expect(helpers.createDocument).toHaveBeenCalledTimes(2)
    expect(helpers.createDocument.mock.calls[0][0].state).toEqual(0)
    expect(helpers.createDocument.mock.calls[1][0].state).toEqual(1)
  })

  test('serialize', () => {
    const state = list(child({ plugin: 'counter' }))
    const deserialized = [
      {
        id: 'foo',
        value: 'foobar'
      },
      {
        id: 'bar',
        value: 'barfoo'
      }
    ]
    expect(
      state.serialize(deserialized, {
        getDocument(id: string) {
          return {
            plugin: 'counter',
            state: id === 'foobar' ? 0 : 1
          }
        }
      })
    ).toEqual([
      { plugin: 'counter', state: 0 },
      { plugin: 'counter', state: 1 }
    ])
  })

  test('return type, empty list', () => {
    const state = list(child({ plugin: 'counter' }))
    const listValue = state.init([], () => {})
    expect(listValue.length).toEqual(0)
  })

  test('return type, non-empty list', () => {
    const state = list(child({ plugin: 'counter' }))
    const listValue = state.init([{ id: 'foo', value: 'bar' }], () => {})
    expect(listValue).toHaveLength(1)
  })

  test('return type, empty list, insert last', () => {
    store = []
    const state = list(child({ plugin: 'counter' }))
    const listValue = state.init(store, onChange)
    listValue.insert()
    expect(store).toHaveLength(1)
    expect(store[0].id).toBeDefined()
    expect(store[0].value).toBeDefined()
  })

  test('return type, one element, insert last', () => {
    store = [
      {
        id: '0',
        value: 'foo'
      }
    ]
    const state = list(child({ plugin: 'counter' }))
    const listValue = state.init(store, onChange)
    listValue.insert()
    expect(store).toHaveLength(2)
    expect(store[0].id).toEqual('0')
  })

  test('return type, one element, insert first', () => {
    store = [
      {
        id: '0',
        value: 'foo'
      }
    ]
    const state = list(child({ plugin: 'counter' }))
    const listValue = state.init(store, onChange)
    listValue.insert(0)
    expect(store).toHaveLength(2)
    expect(store[1].id).toEqual('0')
  })

  test('return type, one element, remove last', () => {
    store = [
      {
        id: '0',
        value: 'foo'
      }
    ]
    const state = list(child({ plugin: 'counter' }))
    const listValue = state.init(store, onChange)
    listValue.remove(0)
    expect(store).toHaveLength(0)
  })

  test('return type, two elements, remove first', () => {
    store = [
      {
        id: '0',
        value: 'foo'
      },
      {
        id: '1',
        value: 'bar'
      }
    ]
    const state = list(child({ plugin: 'counter' }))
    const listValue = state.init(store, onChange)
    listValue.remove(0)
    expect(store).toHaveLength(1)
    expect(store[0].id).toEqual('1')
  })

  test('return type, set', () => {
    store = [
      {
        id: '0',
        value: 'foo'
      },
      {
        id: '1',
        value: 'bar'
      }
    ]
    const state = list(child({ plugin: 'counter' }))
    const listValue = state.init(store, onChange)
    listValue.set(list => {
      return [list[0]]
    })
    expect(store).toHaveLength(1)
    expect(store[0].value).toEqual('foo')
  })

  test('get focusable children', () => {
    const state = list(child({ plugin: 'counter' }))
    expect(state.getFocusableChildren([{ id: 'foo', value: 'bar' }])).toEqual([
      { id: 'bar' }
    ])
  })

  test('inner change', () => {
    store = [
      {
        id: '0',
        value: 'foo'
      },
      {
        id: '1',
        value: 'bar'
      }
    ]

    const state = list(string())
    const listValue = state.init(store, onChange)
    listValue[0].set(val => val + 'bar')
    expect(store).toEqual([
      {
        id: '0',
        value: 'foobar'
      },
      {
        id: '1',
        value: 'bar'
      }
    ])
  })

  test('inner change correctly dispatches changes', () => {
    const state = list(list(child({ plugin: 'counter' }), 0), 1)
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

    const listValue = state.init(initialState, onChange)
    listValue[0].insert()
    expect(helpers.createDocument).toHaveBeenCalledTimes(1)
  })
})
