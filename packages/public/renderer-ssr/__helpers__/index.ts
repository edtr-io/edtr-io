import { plugins } from '@edtr-io/internal__fixtures'
import { StateTypeSerializedType } from '@edtr-io/plugin'
import { TextState } from '@edtr-io/plugin-text'
import * as R from 'ramda'
import { Text } from 'slate'

import { render } from '../src'

export function createTextState(
  texts: Text[]
): StateTypeSerializedType<TextState> {
  return {
    object: 'value',
    document: {
      object: 'document',
      data: {},
      nodes: [
        {
          object: 'block',
          type: 'paragraph',
          data: {},
          nodes: texts.map(text => text.toJSON())
        }
      ]
    }
  }
}

export function addTests<S>({
  name,
  plugin,
  states,
  assert
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
      }
    })
  })
}

export function addTest<S>({
  plugin,
  state,
  assert
}: {
  plugin: string
  state: S
  assert?(html: string): void
}) {
  const { html } = render({
    state: {
      plugin,
      state
    },
    plugins
  })
  if (typeof assert === 'function') {
    assert(html)
  }
}
