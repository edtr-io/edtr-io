import { name, states } from '@edtr-io/plugin-text/__fixtures__'

import { addTest, addTests } from '../__helpers__'

test('Text plugin (w/ strong)', () => {
  addTest({
    plugin: name,
    state: states.strong,
    assert(html) {
      expect(html).toContain('bold text')
      expect(html).toContain('<strong')
    }
  })
})

test('Text plugin (w/ em)', () => {
  addTest({
    plugin: name,
    state: states.em,
    assert(html) {
      expect(html).toContain('emphasized text')
      expect(html).toContain('<em')
    }
  })
})

test('Text plugin (w/ link)', () => {
  addTest({
    plugin: name,
    state: states.link,
    assert(html) {
      expect(html).toContain('Link to edtr.io')
      expect(html).toContain('<a')
      expect(html).toContain('https://edtr.io')
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

test('Text plugin (w/ heading)', () => {
  addTest({
    plugin: name,
    state: states.heading,
    assert(html) {
      expect(html).toContain('heading')
      expect(html).toContain('<h1')
    }
  })
})

addTests({
  name: 'Text',
  plugin: name,
  states
})
