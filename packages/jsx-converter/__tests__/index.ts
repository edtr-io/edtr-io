import hast from 'hastscript'

import { toJSX, convertPluginStateToHast, convertValueToHast } from '../src'

test('toJSX', () => {
  expect(toJSX({ plugin: 'Foo', state: null })).toEqual('')
})

test('Function convertPluginStateToHast()', () => {
  // Plugins with state of primitive data type
  expect(convertPluginStateToHast({ plugin: 'hello', state: 42 })).toEqual(
    hast('hello', '42')
  )
  expect(convertPluginStateToHast({ plugin: 'hello', state: false })).toEqual(
    hast('hello', 'false')
  )
  expect(
    convertPluginStateToHast({ plugin: 'hello', state: 'I am a string' })
  ).toEqual(hast('hello', 'I am a string'))
})

test('Function convertValueToHast()', () => {
  expect(convertValueToHast('foo', 42)).toEqual(hast('foo', '42'))
  expect(convertValueToHast('foo', 'hello world')).toEqual(
    hast('foo', 'hello world')
  )
  expect(convertValueToHast('foo', true)).toEqual(hast('foo', 'true'))
  expect(convertValueToHast('foo', false)).toEqual(hast('foo', 'false'))
})
