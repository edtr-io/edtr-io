import { name, states } from '@edtr-io/plugin-image/__fixtures__'

import { addTests } from '../__helpers__'

addTests({
  name: 'Images',
  plugin: name,
  states,
  assert(state, html) {
    expect(html).toContain('<img')
  },
})
