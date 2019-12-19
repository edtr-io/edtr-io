import { plugins } from '@edtr-io/internal__fixtures'
import { StateTypeSerializedType } from '@edtr-io/internal__plugin-state'
import { SerloInjectionState } from '@edtr-io/plugin-serlo-injection'

import { render } from '../src'

test('Serlo injection plugin', () => {
  const state: {
    plugin: string
    state: StateTypeSerializedType<SerloInjectionState>
  } = {
    plugin: 'serloInjection',
    state: '1337'
  }
  const { html } = render({
    state,
    plugins
  })
  expect(html).toContain('<iframe')
})
