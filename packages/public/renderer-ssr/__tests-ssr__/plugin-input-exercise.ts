import { name, states } from '@edtr-io/plugin-input-exercise/__fixtures__'

import { addTests } from '../__helpers__'

addTests({
  name: 'Input Exercise',
  plugin: name,
  states,
  assert(state, html) {
    expect(html).toContain('<input')
  },
})
