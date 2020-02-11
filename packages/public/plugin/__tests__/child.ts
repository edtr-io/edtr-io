import { SubDocument } from '@edtr-io/core'
import { render } from '@testing-library/react'

import { child, PluginProps, StoreDeserializeHelpers } from '../src'

jest.mock('@edtr-io/core/sub-document')

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
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(helpers.createDocument).toHaveBeenCalledTimes(1)
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(helpers.createDocument).toBeCalledWith({
      id
    })
  })

  test('given plugin, initial state', () => {
    const state = child({ plugin: 'counter' })

    // Store
    const id = state.createInitialState(helpers)
    expect(typeof id).toEqual('string')
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(helpers.createDocument).toHaveBeenCalledTimes(1)
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(helpers.createDocument).toBeCalledWith({
      id,
      plugin: 'counter'
    })
  })

  test('given plugin, given state', () => {
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
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(helpers.createDocument).toHaveBeenCalledTimes(1)
    // eslint-disable-next-line @typescript-eslint/unbound-method
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
    const childValue = state.init(id, () => {})
    expect(childValue.get()).toEqual(id)
    expect(childValue.id).toEqual(id)
    expect(typeof childValue.render).toEqual('function')
  })

  test('get focusable children', () => {
    const state = child()
    expect(state.getFocusableChildren('foo')).toEqual([{ id: 'foo' }])
  })

  test('plugin config', () => {
    const state = child()
    const id = 'foo'
    const childValue = state.init(id, () => {})
    let pluginProps: PluginProps = {}
    // @ts-ignore
    SubDocument.mockImplementation((props: { pluginProps: PluginProps }) => {
      pluginProps = props.pluginProps
      return null
    })
    // @ts-ignore
    render(childValue.render())
    expect(pluginProps.config).toEqual({})
  })

  test('plugin config, overridden in child', () => {
    const state = child({ config: { foo: 'bar' } })
    const id = 'foo'
    const childValue = state.init(id, () => {})
    let pluginProps: PluginProps = {}
    // @ts-ignore
    SubDocument.mockImplementation((props: { pluginProps: PluginProps }) => {
      pluginProps = props.pluginProps
      return null
    })
    // @ts-ignore
    render(childValue.render())
    expect(pluginProps.config).toEqual({ foo: 'bar' })
  })

  test('plugin config, overridden in render', () => {
    const state = child()
    const childValue = state.init('foo', () => {})
    let pluginProps: PluginProps = {}
    // @ts-ignore
    SubDocument.mockImplementation((props: { pluginProps: PluginProps }) => {
      pluginProps = props.pluginProps
      return null
    })
    // @ts-ignore
    render(childValue.render({ config: { foo: 'bar' } }))
    expect(pluginProps.config).toEqual({ foo: 'bar' })
  })

  test('plugin config, overridden in both child and render', () => {
    const state = child({ config: { foo: 'foo' } })
    const childValue = state.init('foo', () => {})
    let pluginProps: PluginProps = {}
    // @ts-ignore
    SubDocument.mockImplementation((props: { pluginProps: PluginProps }) => {
      pluginProps = props.pluginProps
      return null
    })
    // @ts-ignore
    render(childValue.render({ config: { foo: 'bar' } }))
    expect(pluginProps.config).toEqual({ foo: 'bar' })
  })
})
