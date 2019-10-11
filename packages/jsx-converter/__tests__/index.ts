import hast from 'hastscript'

import { toJSX, convertValueToHast } from '../src'

test('toJSX', () => {
  expect(toJSX({ plugin: 'Foo', state: null })).toEqual('')
})

test('Function convertValueToHast()', () => {
  expect(convertValueToHast('foo', 42)).toEqual(hast('foo', '42'))
  expect(convertValueToHast('foo', 'hello world')).toEqual(
    hast('foo', 'hello world')
  )
  expect(convertValueToHast('foo', true)).toEqual(hast('foo', 'true'))
  expect(convertValueToHast('foo', false)).toEqual(hast('foo', 'false'))
})
