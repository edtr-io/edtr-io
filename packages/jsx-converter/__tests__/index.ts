import hast from 'hastscript'

import { toJSX, convertPluginStateToHast, convertValueToHast } from '../src'

test('toJSX', () => {
  expect(toJSX({ plugin: 'Foo', state: null })).toEqual('')
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
