import { name, states } from '@edtr-io/plugin-anchor/__fixtures__'

import { addTests } from '../__helpers__'

addTests({
  name: 'Anchor',
  plugin: name,
  states,
  assert(state, html) {
    expect(html).toContain('<a')
    expect(html).toContain(`id="${state}"`)
  }
})
