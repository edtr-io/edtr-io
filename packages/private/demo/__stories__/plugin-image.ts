import { name, states } from '@edtr-io/plugin-image/__fixtures__'

import { addPluginStories } from '../src'

addPluginStories({
  name: 'Image',
  plugin: name,
  states: states
})
