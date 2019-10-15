import hast from 'hastscript'
import {
  serializePlugin,
  convertPluginToHast,
  convertValueToHast
} from '../src'

// Examples for serialization of plugin states
const serializePluginExamples = [
  // Stateful plugins with state of primitive data type
  {
    plugin: { plugin: 'NumberStatePlugin', state: 42 },
    markup: '<NumberStatePlugin>42</NumberStatePlugin>'
  },
  {
    plugin: { plugin: 'boolean', state: false },
    markup: '<boolean>false</boolean>'
  },
  {
    plugin: { plugin: 'string-plugin', state: 'Hello World' },
    markup: '<string-plugin>Hello World</string-plugin>'
  }
]

test('serializePlugin()', () => {
  serializePluginExamples.forEach(example =>
    expect(serializePlugin(example.plugin)).toEqual(example.markup)
  )
})

test('convertPluginToHast()', () => {
  const testCases = [
    // Plugins with state of primitive data type
    {
      arg: { plugin: 'hello', state: 42 },
      result: hast('hello', '42')
    },
    {
      arg: { plugin: 'my-plugin', state: false },
      result: hast('my-plugin', 'false')
    },
    {
      arg: { plugin: 'stringplugin', state: 'I am a string' },
      result: hast('stringplugin', 'I am a string')
    }
  ]

  testCases.forEach(testCase =>
    expect(convertPluginToHast(testCase.arg)).toEqual(testCase.result)
  )
})

type ConvertValueToHastExamples = {
  args: [string, string | number | boolean]
  result: any
}[]

test('convertValueToHast()', () => {
  const testCases: ConvertValueToHastExamples = [
    {
      args: ['foo', 42],
      result: hast('foo', '42')
    },
    {
      args: ['boolean', true],
      result: hast('boolean', 'true')
    },
    {
      args: ['string-plugin', 'hello world'],
      result: hast('string-plugin', 'hello world')
    }
  ]

  testCases.forEach(testCase =>
    expect(convertValueToHast(...testCase.args)).toEqual(testCase.result)
  )
})
