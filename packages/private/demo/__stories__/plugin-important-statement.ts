import { name, states } from '@edtr-io/plugin-important-statement/__fixtures__'

import { addPluginStories } from '../src'

addPluginStories({
  name: 'Important Statement',
  plugin: name,
  states: states
})
