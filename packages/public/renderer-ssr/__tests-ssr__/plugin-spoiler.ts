import { name, states } from '@edtr-io/plugin-spoiler/__fixtures__'

import { addTests } from '../__helpers__'

addTests({
  name: 'Spoiler',
  plugin: name,
  states,
  assert(state, html) {
    expect(html).toContain('a spoiler')
  },
})
