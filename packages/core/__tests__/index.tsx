import * as React from 'react'
import { render } from 'react-testing-library'

import { Bar, foo } from '../src'

test('foo', () => {
  expect(foo).toBe('bar')
})

test('Bar', () => {
  const { container } = render(<Bar name="World" />)
  expect(container.innerHTML).toContain('Hello World')
})
