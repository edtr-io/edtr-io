import { name, states } from '@edtr-io/plugin-important-statement/__fixtures__'

import { addTests } from '../__helpers__'

addTests({
  name: 'Important Statement',
  plugin: name,
  states,
  assert(state, html) {
    expect(html).toContain('important statement')
  }
})
