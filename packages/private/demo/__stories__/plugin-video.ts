import { name, states } from '@edtr-io/plugin-video/__fixtures__'

import { addPluginStories } from '../src'

addPluginStories({
  name: 'Video',
  plugin: name,
  states: states
})
