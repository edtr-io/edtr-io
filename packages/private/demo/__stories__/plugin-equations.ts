import { name, states } from '@edtr-io/plugin-equations/__fixtures__'

import { addStory, addPluginStories } from '../src'

addPluginStories({
  name: 'Equations',
  plugin: name,
  states: states
})

addStory('Plugins/Equations/Prefilled', {
  state: JSON.parse(
    '{"plugin":"rows","state":[{"plugin":"equations","state":{"steps":[{"left":{"plugin":"text","state":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"3x + 1+354x -45234","marks":[]}]}]}]}}},"right":{"plugin":"text","state":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"= 4 +3x -5","marks":[]}]}]}]}}},"transform":{"plugin":"text","state":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"|-1 1435 13454 ","marks":[]}]}]}]}}}},{"left":{"plugin":"text","state":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"3x","marks":[]}]}]}]}}},"right":{"plugin":"text","state":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"= 3","marks":[]}]}]}]}}},"transform":{"plugin":"text","state":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"|:3","marks":[]}]}]}]}}}},{"left":{"plugin":"text","state":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"x","marks":[]}]}]}]}}},"right":{"plugin":"text","state":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"= 1","marks":[]}]}]}]}}},"transform":{"plugin":"text","state":{"document":{"nodes":[{"object":"block","type":"paragraph","nodes":[{"object":"text","leaves":[{"object":"leaf","text":""}]}]}]}}}}]}}]}'
  )
})
