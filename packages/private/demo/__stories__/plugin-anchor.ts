import { name, states } from '@edtr-io/plugin-anchor/__fixtures__'

import { addPluginStories } from '../src'

addPluginStories({
  name: 'Anchor',
  plugin: name,
  states: states,
})
