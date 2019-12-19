import { name, states } from '@edtr-io/plugin-solution/__fixtures__'

import { addTests } from '../__helpers__'

addTests({
  name: 'Solution',
  plugin: name,
  states,
  assert(state, html) {
    expect(html).toContain('Lösung')
    expect(html).toContain('anzeigen')
  }
})
