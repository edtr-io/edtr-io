import { name, states } from '@edtr-io/plugin-highlight/__fixtures__'

import { addTests } from '../__helpers__'

addTests({
  name: 'Highlight',
  plugin: name,
  states,
  assert(state, html) {
    expect(html).toContain('console.log')
  },
})
