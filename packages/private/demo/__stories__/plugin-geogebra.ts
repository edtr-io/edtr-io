import { name, states } from '@edtr-io/plugin-geogebra/__fixtures__'

import { addPluginStories } from '../src'

addPluginStories({
  name: 'GeoGebra',
  plugin: name,
  states: states
})
