import { name, states } from '@edtr-io/plugin-rows/__fixtures__'

import { addTests } from '../__helpers__'

addTests({
  name: 'Rows',
  plugin: name,
  states,
  assert(state, html) {
    expect(html).toContain('Hello world')
  },
})
