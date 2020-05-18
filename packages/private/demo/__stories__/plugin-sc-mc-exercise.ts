import { name, states } from '@edtr-io/plugin-sc-mc-exercise/__fixtures__'

import { addPluginStories } from '../src'

addPluginStories({
  name: 'Sc Mc Exercise',
  plugin: name,
  states: states,
})
