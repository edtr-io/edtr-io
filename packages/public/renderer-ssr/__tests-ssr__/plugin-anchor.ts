import { plugins } from '@edtr-io/internal__fixtures'
import { StateTypeSerializedType } from '@edtr-io/internal__plugin-state'
import { AnchorState } from '@edtr-io/plugin-anchor'

import { render } from '../src'

test('Anchor plugin', () => {
  const state: {
    plugin: string
    state: StateTypeSerializedType<AnchorState>
  } = {
    plugin: 'anchor',
    state: 'foo'
  }
  const { html } = render({
    state,
    plugins
  })
  expect(html).toContain('<a')
  expect(html).toContain('id="foo"')
})
