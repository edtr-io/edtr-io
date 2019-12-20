import { name, states } from '@edtr-io/plugin-equations/__fixtures__'

import { addTests } from '../__helpers__'

addTests({
  name: 'Equations',
  plugin: name,
  states,
  assert(state, html) {
    expect(html).toContain('left')
    expect(html).toContain('right')
    expect(html).toContain('transform')
  }
})
