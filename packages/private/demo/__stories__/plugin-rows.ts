import { name, states } from '@edtr-io/plugin-rows/__fixtures__'

import { addPluginStories } from '../src'

addPluginStories({
  name: 'Rows',
  plugin: name,
  states: states,
})
