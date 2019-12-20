import { name, states } from '@edtr-io/plugin-serlo-injection/__fixtures__'

import { addTests } from '../__helpers__'

addTests({
  name: 'Serlo Injection',
  plugin: name,
  states,
  assert(state, html) {
    expect(html).toContain('<iframe')
  }
})
