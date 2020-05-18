import { name, states } from '@edtr-io/plugin-files/__fixtures__'

import { addTests } from '../__helpers__'

addTests({
  name: 'Files',
  plugin: name,
  states,
  assert(state, html) {
    expect(html).toContain('<svg')
  },
})
