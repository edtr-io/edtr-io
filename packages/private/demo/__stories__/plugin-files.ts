import { name, states } from '@edtr-io/plugin-files/__fixtures__'

import { addPluginStories } from '../src'

addPluginStories({
  name: 'Files',
  plugin: name,
  states: states
})
