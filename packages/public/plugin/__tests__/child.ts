// eslint-disable-next-line import/no-extraneous-dependencies
import { jest } from '@jest/globals'
import { render } from '@testing-library/react'

import { PluginProps, StoreDeserializeHelpers } from '../src'

let pluginProps: PluginProps = {}

// See https://jestjs.io/docs/ecmascript-modules#module-mocking-in-esm
jest.unstable_mockModule('@edtr-io/core/sub-document', () => ({
  SubDocument: jest
    .fn()
    // @ts-expect-error: `child` is not yet imported when this is evaluated,
    // and therefore has the type "unknown"
    .mockImplementation((props: { pluginProps: PluginProps }) => {
      pluginProps = props.pluginProps
      return null
    }),
}))

const { child } = await import('../src')

describe('Child', () => {
  let helpers: StoreDeserializeHelpers<string, number>

  beforeEach(() => {
    helpers = {
      createDocument: jest.fn(),
    }
  })

  test('initial state', () => {
    const state = child({ plugin: 'counter' })

    // Store
    const id = state.createInitialState(helpers)
    expect(typeof id).toEqual('string')
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(helpers.createDocument).toHaveBeenCalledTimes(1)
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(helpers.createDocument).toBeCalledWith({
      id,
      plugin: 'counter',
    })
  })

  test('given state', () => {
    const state = child({ plugin: 'counter', initialState: 3 })

    // Store
    const id = state.createInitialState(helpers)
    expect(typeof id).toEqual('string')
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(helpers.createDocument).toHaveBeenCalledTimes(1)
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(helpers.createDocument).toBeCalledWith({
      id,
      plugin: 'counter',
      state: 3,
    })
  })

  test('deserialize', () => {
    const state = child({ plugin: 'counter' })
    const serialized = {
      plugin: 'counter',
      state: 0,
    }

    // Store
    const id = state.deserialize(serialized, helpers)
    expect(typeof id).toEqual('string')
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(helpers.createDocument).toHaveBeenCalledTimes(1)
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(helpers.createDocument).toBeCalledWith({
      id,
      plugin: 'counter',
      state: 0,
    })
  })

  test('serialize', () => {
    const state = child<'counter', number>({ plugin: 'counter' })
    const deserialized = 'foo'

    const serialized = state.serialize(deserialized, {
      getDocument(id: string) {
        if (id === 'foo') {
          return {
            plugin: 'counter',
            state: 0,
          }
        }
        return null
      },
    })
    expect(serialized).toEqual({
      plugin: 'counter',
      state: 0,
    })
  })

  test('return type', () => {
    const state = child({ plugin: 'counter' })
    const id = 'foo'
    const childValue = state.init(id, () => {})
    expect(childValue.get()).toEqual(id)
    expect(childValue.id).toEqual(id)
    expect(typeof childValue.render).toEqual('function')
  })

  test('get focusable children', () => {
    const state = child({ plugin: 'counter' })
    expect(state.getFocusableChildren('foo')).toEqual([{ id: 'foo' }])
  })

  test('plugin config', () => {
    const state = child({ plugin: 'counter' })
    const id = 'foo'
    const childValue = state.init(id, () => {})
    render(childValue.render())
    expect(pluginProps.config).toEqual({})
  })

  test('plugin config, overridden in child', () => {
    const state = child({ plugin: 'counter', config: { foo: 'bar' } })
    const id = 'foo'
    const childValue = state.init(id, () => {})
    render(childValue.render())
    expect(pluginProps.config).toEqual({ foo: 'bar' })
  })

  test('plugin config, overridden in render', () => {
    const state = child({ plugin: 'counter' })
    const childValue = state.init('foo', () => {})
    render(childValue.render({ config: { foo: 'bar' } }))
    expect(pluginProps.config).toEqual({ foo: 'bar' })
  })

  test('plugin config, overridden in both child and render', () => {
    const state = child({ plugin: 'counter', config: { foo: 'foo' } })
    const childValue = state.init('foo', () => {})
    render(childValue.render({ config: { foo: 'bar' } }))
    expect(pluginProps.config).toEqual({ foo: 'bar' })
  })
})
