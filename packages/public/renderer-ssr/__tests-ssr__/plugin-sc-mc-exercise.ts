import { name, states } from '@edtr-io/plugin-sc-mc-exercise/__fixtures__'

import { addTests } from '../__helpers__'

addTests({
  name: 'Sc Mc Exercise',
  plugin: name,
  states,
  assert(state, html) {
    expect(html).toContain('correct')
  }
})
