import { name, states } from '@edtr-io/plugin-input-exercise/__fixtures__'

import { addPluginStories } from '../src'

addPluginStories({
  name: 'Input Exercise',
  plugin: name,
  states: states,
})
