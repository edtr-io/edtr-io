import { name, states } from '@edtr-io/plugin-equations/__fixtures__'

import { addStory, addPluginStories } from '../src'

addPluginStories({
  name: 'Equations',
  plugin: name,
  states: states
})

addStory('Plugins/Equations/Prefilled', {
  state: JSON.parse(
    '{"plugin":"rows","state":[{"plugin":"equations","state":{"steps":[{"left":{"plugin":"text-legacy","state":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text-legacy","leaves":[{"object":"leaf","text-legacy":"3x + 1+354x -45234","marks":[]}]}]}]}}},"right":{"plugin":"text-legacy","state":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text-legacy","leaves":[{"object":"leaf","text-legacy":"= 4 +3x -5","marks":[]}]}]}]}}},"transform":{"plugin":"text-legacy","state":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text-legacy","leaves":[{"object":"leaf","text-legacy":"|-1 1435 13454 ","marks":[]}]}]}]}}}},{"left":{"plugin":"text-legacy","state":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text-legacy","leaves":[{"object":"leaf","text-legacy":"3x","marks":[]}]}]}]}}},"right":{"plugin":"text-legacy","state":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text-legacy","leaves":[{"object":"leaf","text-legacy":"= 3","marks":[]}]}]}]}}},"transform":{"plugin":"text-legacy","state":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text-legacy","leaves":[{"object":"leaf","text-legacy":"|:3","marks":[]}]}]}]}}}},{"left":{"plugin":"text-legacy","state":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text-legacy","leaves":[{"object":"leaf","text-legacy":"x","marks":[]}]}]}]}}},"right":{"plugin":"text-legacy","state":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text-legacy","leaves":[{"object":"leaf","text-legacy":"= 1","marks":[]}]}]}]}}},"transform":{"plugin":"text-legacy","state":{"document":{"nodes":[{"object":"block","type":"paragraph","nodes":[{"object":"text-legacy","leaves":[{"object":"leaf","text-legacy":""}]}]}]}}}}]}}]}'
  )
})
