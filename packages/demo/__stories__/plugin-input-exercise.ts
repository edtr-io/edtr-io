import { addStory } from '../src'

addStory('Plugins/Input Exercise/Initial State', {
  state: {
    plugin: 'rows',
    state: [
      {
        plugin: 'inputExercise'
      }
    ]
  }
})

addStory('Plugins/Input Exercise/Prefilled', {
  state: JSON.parse(
    '{"plugin":"rows","state":[{"plugin":"inputExercise","state":{"type":"Text","answers":[{"value":"Das Haus","isCorrect":true,"feedback":{"plugin":"text","state":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"Yeah!","marks":[]}]}]}]}}}},{"value":"Der Garten","isCorrect":false,"feedback":{"plugin":"text","state":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"Oh no","marks":[]}]}]}]}}}},{"value":"Haus","isCorrect":true,"feedback":{"plugin":"text","state":{"document":{"nodes":[{"object":"block","type":"paragraph","nodes":[{"object":"text","leaves":[{"object":"leaf","text":""}]}]}]}}}},{"value":"Garten","isCorrect":false,"feedback":{"plugin":"text","state":{"document":{"nodes":[{"object":"block","type":"paragraph","nodes":[{"object":"text","leaves":[{"object":"leaf","text":""}]}]}]}}}}]}}]}'
  )
})
