import { name, states } from '@edtr-io/plugin-serlo-injection/__fixtures__'

import { addPluginStories } from '../src'

addPluginStories({
  name: 'Serlo Injection',
  plugin: name,
  states: states
})
