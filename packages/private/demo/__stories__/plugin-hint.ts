import { name, states } from '@edtr-io/plugin-hint/__fixtures__'

import { addPluginStories } from '../src'

addPluginStories({
  name: 'Hint',
  plugin: name,
  states: states
})
