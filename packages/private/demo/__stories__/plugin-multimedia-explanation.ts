import {
  name,
  states,
} from '@edtr-io/plugin-multimedia-explanation/__fixtures__'

import { addPluginStories } from '../src'

addPluginStories({
  name: 'Multimedia Explanation',
  plugin: name,
  states: states,
})
