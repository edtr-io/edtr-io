import { plugins } from '@edtr-io/internal__fixtures'
import { StateTypeSerializedType } from '@edtr-io/internal__plugin-state'
import { TextState } from '@edtr-io/plugin-text'
import { render } from '@edtr-io/renderer-ssr'
import * as R from 'ramda'
import { Text } from 'slate'

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
  assert(state: S, html: string): void
}) {
  test.each(R.toPairs(states))(`${name} plugin (%s)`, (_, state) => {
    const { html } = render({
      state: {
        plugin,
        state
      },
      plugins
    })
    assert(state, html)
  })
}
