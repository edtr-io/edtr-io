import { name, states } from '@edtr-io/plugin-table/__fixtures__'

import { addPluginStories } from '../src'

addPluginStories({
  name: 'Table',
  plugin: name,
  states: states,
})
