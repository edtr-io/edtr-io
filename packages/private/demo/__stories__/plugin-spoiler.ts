import { addStory } from '../src'

addStory('Plugins/Spoiler/Initial State', {
  state: {
    plugin: 'rows',
    state: [
      {
        plugin: 'spoiler'
      }
    ]
  }
})

addStory('Plugins/Spoiler/Prefilled', {
  state: JSON.parse(
    '{"plugin":"rows","state":[{"plugin":"spoiler","state":{"title":"Test","content":{"plugin":"rows","state":[{"plugin":"text","state":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"Hier habe ich einen Spoiler. ","marks":[]}]}]}]}}},{"plugin":"text","state":{"document":{"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"Spoiler können zum Beispiel für Exkurse spannend sein.","marks":[]}]}]}]}}}]}}}]}'
  )
})
