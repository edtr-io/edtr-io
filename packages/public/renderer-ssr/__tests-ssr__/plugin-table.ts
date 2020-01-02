import { name, states } from '@edtr-io/plugin-table/__fixtures__'

import { addTests } from '../__helpers__'

addTests({
  name: 'Table',
  plugin: name,
  states,
  assert(state, html) {
    expect(html).toContain('<table')
  }
})
