import hast from 'hastscript'
import {
  serializePluginState,
  convertPluginStateToHast,
  convertValueToHast
} from '../src'

// Examples for serialization of plugin states
const serializePluginStateExamples = [
  // Stateful plugins with state of primitive data type
  {
    state: { plugin: 'NumberStatePlugin', state: 42 },
    markup: '<NumberStatePlugin>42</NumberStatePlugin>'
  },
  {
    state: { plugin: 'boolean', state: false },
    markup: '<boolean>false</boolean>'
  },
  {
    state: { plugin: 'string-plugin', state: 'Hello World' },
    markup: '<string-plugin>Hello World</string-plugin>'
  }
]

test('Function serializePluginState()', () => {
  serializePluginStateExamples.forEach(example =>
    expect(serializePluginState(example.state)).toEqual(example.markup)
  )
})

test('Function convertPluginStateToHast()', () => {
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
    expect(convertPluginStateToHast(testCase.arg)).toEqual(testCase.result)
  )
})

test('Function convertValueToHast()', () => {
  const testCases = [
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
