import { child, StoreDeserializeHelpers } from '../../src/plugin-state'

describe('Child', () => {
  let helpers: StoreDeserializeHelpers<string, number>

  beforeEach(() => {
    helpers = {
      createDocument: jest.fn()
    }
  })

  test('default plugin, initial state', () => {
    const state = child()

    // Store
    const id = state.createInitialState(helpers)
    expect(typeof id).toEqual('string')
    expect(helpers.createDocument).toHaveBeenCalledTimes(1)
    expect(helpers.createDocument).toBeCalledWith({
      id
    })
  })

  test('given plugin, initial state', () => {
    const state = child('counter')

    // Store
    const id = state.createInitialState(helpers)
    expect(typeof id).toEqual('string')
    expect(helpers.createDocument).toHaveBeenCalledTimes(1)
    expect(helpers.createDocument).toBeCalledWith({
      id,
      plugin: 'counter'
    })
  })

  test('given plugin, given state', () => {
    const state = child('counter', 3)

    // Store
    const id = state.createInitialState(helpers)
    expect(typeof id).toEqual('string')
    expect(helpers.createDocument).toHaveBeenCalledTimes(1)
    expect(helpers.createDocument).toBeCalledWith({
      id,
      plugin: 'counter',
      state: 3
    })
  })

  test('deserialize', () => {
    const state = child()
    const serialized = {
      plugin: 'counter',
      state: 0
    }

    // Store
    const id = state.deserialize(serialized, helpers)
    expect(typeof id).toEqual('string')
    expect(helpers.createDocument).toHaveBeenCalledTimes(1)
    expect(helpers.createDocument).toBeCalledWith({
      id,
      plugin: 'counter',
      state: 0
    })
  })

  test('serialize', () => {
    const state = child<'counter', number>()
    const deserialized = 'foo'

    const serialized = state.serialize(deserialized, {
      getDocument(id: string) {
        if (id === 'foo') {
          return {
            id,
            plugin: 'counter',
            state: 0
          }
        }
        return null
      }
    })
    expect(serialized).toEqual({
      plugin: 'counter',
      state: 0
    })
  })

  test('return type', () => {
    const state = child()
    const id = 'foo'
    const childValue = state(id, () => {})
    expect(childValue()).toEqual(id)
    expect(childValue.id).toEqual(id)
    expect(typeof childValue.render).toEqual('function')
  })
})
