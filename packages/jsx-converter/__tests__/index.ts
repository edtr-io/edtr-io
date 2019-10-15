import hast from 'hastscript'
import {
  serializePlugin,
  convertPluginToHast,
  convertValueToHast
} from '../src'

// Examples for serialization of plugin states
const serializePluginExamples = [
  // Stateful plugins with state of primitive data type
  [
    { plugin: 'NumberStatePlugin', state: 42 },
    '<NumberStatePlugin>42</NumberStatePlugin>'
  ],
  [{ plugin: 'boolean', state: false }, '<boolean>false</boolean>'],
  [
    { plugin: 'string-plugin', state: 'Hello World' },
    '<string-plugin>Hello World</string-plugin>'
  ]
]

describe('serializePlugin()', () => {
  test.each(serializePluginExamples)('Serialize plugin %j', (plugin, markup) =>
    expect(serializePlugin(plugin)).toEqual(markup)
  )
})

describe('convertPluginToHast()', () => {
  test.each([
    [{ plugin: 'hello', state: 42 }, hast('hello', '42')],
    [{ plugin: 'my-plugin', state: false }, hast('my-plugin', 'false')],
    [
      { plugin: 'string', state: 'string state' },
      hast('string', 'string state')
    ]
  ])('Convert plugin %j to hast', (plugin, result) =>
    expect(convertPluginToHast(plugin)).toEqual(result)
  )
})

describe('convertValueToHast()', () => {
  test.each`
    tagName         | value            | result
    ${'foo'}        | ${42}            | ${hast('foo', '42')}
    ${'boolean'}    | ${true}          | ${hast('boolean', 'true')}
    ${'str-plugin'} | ${'hello world'} | ${hast('str-plugin', 'hello world')}
  `(
    'Convert value "$value" with tag name "$tagName"',
    ({ tagName, value, result }) =>
      expect(convertValueToHast(tagName, value)).toEqual(result)
  )
})
