import { name, states } from '@edtr-io/plugin-spoiler/__fixtures__'

import { addPluginStories } from '../src'

addPluginStories({
  name: 'Spoiler',
  plugin: name,
  states: states,
})
