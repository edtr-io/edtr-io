import { name, states } from '@edtr-io/plugin-highlight/__fixtures__'

import { addPluginStories } from '../src'

addPluginStories({
  name: 'Highlight',
  plugin: name,
  states: states
})
