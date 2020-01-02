import { name, states } from '@edtr-io/plugin-hint/__fixtures__'

import { addTests } from '../__helpers__'

addTests({
  name: 'Hint',
  plugin: name,
  states,
  assert(state, html) {
    expect(html).toContain('Tipp')
    expect(html).toContain('anzeigen')
  }
})
