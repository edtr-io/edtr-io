import { plugins } from '@edtr-io/internal__fixtures'
import * as R from 'ramda'

import { render } from '../src'

export function addTests<S>({
  name,
  plugin,
  states,
  assert,
}: {
  name: string
  plugin: string
  states: Record<string, S>
  assert?(state: S, html: string): void
}) {
  test.each(R.toPairs(states))(`${name} plugin (%s)`, (_, state) => {
    addTest({
      plugin,
      state,
      assert(html) {
        if (typeof assert === 'function') {
          assert(state, html)
        }
      },
    })
  })
}

export function addTest<S>({
  plugin,
  state,
  assert,
}: {
  plugin: string
  state: S
  assert?(html: string): void
}) {
  const { html } = render({
    state: {
      plugin,
      state,
    },
    plugins,
  })
  if (typeof assert === 'function') {
    assert(html)
  }
}
