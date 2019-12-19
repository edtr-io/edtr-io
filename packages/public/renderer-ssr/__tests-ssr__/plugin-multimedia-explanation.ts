import {
  name,
  states
} from '@edtr-io/plugin-multimedia-explanation/__fixtures__'

import { addTests } from '../__helpers__'

addTests({
  name: 'Multimedia Explanation',
  plugin: name,
  states,
  assert(state, html) {
    expect(html).toContain('<img')
  }
})
