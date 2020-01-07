import { name, states } from '@edtr-io/plugin-text/__fixtures__'

import { addTest, addTests } from '../__helpers__'

test('Text plugin (w/ bold)', () => {
  addTest({
    plugin: name,
    state: states.bold,
    assert(html) {
      expect(html).toContain('bold')
      expect(html).toContain('<strong')
    }
  })
})

test('Text plugin (w/ color)', () => {
  addTest({
    plugin: name,
    state: states.color,
    assert(html) {
      expect(html).toContain('color')
    }
  })
})

addTests({
  name: 'Text',
  plugin: name,
  states
})
