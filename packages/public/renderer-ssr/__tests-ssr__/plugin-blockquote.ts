import { name, states } from '@edtr-io/plugin-blockquote/__fixtures__'

import { addTests } from '../__helpers__'

addTests({
  name: 'Blockquote',
  plugin: name,
  states,
  assert(_state, html) {
    expect(html).toContain('<blockquote')
  }
})
