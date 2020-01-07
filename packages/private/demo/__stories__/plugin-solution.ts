import { name, states } from '@edtr-io/plugin-solution/__fixtures__'

import { addPluginStories } from '../src'

addPluginStories({
  name: 'Solution',
  plugin: name,
  states: states
})
