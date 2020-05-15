import { name, states } from '@edtr-io/plugin-blockquote/__fixtures__'

import { addPluginStories } from '../src'

addPluginStories({
  name: 'Blockquote',
  plugin: name,
  states: states,
})
