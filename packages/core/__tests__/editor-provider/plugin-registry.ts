import { PluginRegistry } from '../../src/editor-provider/plugin-registry'
import { Plugin } from '../../src'

const fooPlugin: Plugin = {
  Component: () => null
}

describe('Plugin Registry', () => {
  test('empty plugin registry', () => {
    const registry = new PluginRegistry<string>({})
    expect(registry.getPlugin('foo')).toBeNull()
  })

  test('existing plugin', () => {
    const registry = new PluginRegistry({
      foo: fooPlugin
    })
    expect(registry.getPlugin('foo')).toEqual(fooPlugin)
  })

  test('missing plugin', () => {
    const registry = new PluginRegistry<string>({
      foo: fooPlugin
    })
    expect(registry.getPlugin('bar')).toBeNull()
  })
})
