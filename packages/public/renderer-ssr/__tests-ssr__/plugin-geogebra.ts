import { name, states } from '@edtr-io/plugin-geogebra/__fixtures__'

import { addTests } from '../__helpers__'

addTests({
  name: 'GeoGebra',
  plugin: name,
  states,
  assert(state, html) {
    expect(html).toContain('geogebra')
  }
})
