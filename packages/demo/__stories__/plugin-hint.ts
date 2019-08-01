import { addStory } from '../src'

addStory('Plugins/Hint/Initial State', {
  state: {
    plugin: 'rows',
    state: [
      {
        plugin: 'hint'
      }
    ]
  }
})

addStory('Plugins/Hint/Prefilled', {
  state: JSON.parse(
    '{"plugin":"rows","state":[{"plugin":"hint","state":{"title":"erster Tipp","content":{"plugin":"rows","state":[{"plugin":"text","state":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"Dies ist ein Hinweis. Er hilft, wenn man nicht sofort die gesamte Lösung sehen will. ","marks":[]}]}]}]}}}]}}}]}'
  )
})
