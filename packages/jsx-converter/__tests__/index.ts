import hast from 'hastscript'

import { toJSX, convertPropertyToHast } from '../src'

test('toJSX', () => {
  expect(toJSX({ plugin: 'Foo', state: null })).toEqual('')
})

test('Function convertPropertyToHast()', () => {
  expect(convertPropertyToHast('foo', 42)).toEqual(hast('foo', '42'))
  expect(convertPropertyToHast('foo', 'hello world')).toEqual(
    hast('foo', 'hello world')
  )
  expect(convertPropertyToHast('foo', true)).toEqual(hast('foo', 'true'))
  expect(convertPropertyToHast('foo', false)).toEqual(hast('foo', 'false'))
})
