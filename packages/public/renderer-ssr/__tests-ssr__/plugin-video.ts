import { name, states } from '@edtr-io/plugin-video/__fixtures__'

import { addTests } from '../__helpers__'

addTests({
  name: 'Video',
  plugin: name,
  states,
  assert(state, html) {
    expect(html).toContain('youtube')
  },
})
