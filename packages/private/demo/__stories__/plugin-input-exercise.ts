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

addStory('Plugins/Input Exercise/Prefilled V1', {
  state: JSON.parse(
    '{"plugin":"rows","state":[{"plugin":"inputExercise","state":{"__version__":1,"value":{"type":"Text","answers":[{"value":"Das Haus","isCorrect":true,"feedback":{"plugin":"text","state":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"Yeah!","marks":[]}]}]}]}}}},{"value":"Der Garten","isCorrect":false,"feedback":{"plugin":"text","state":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"Oh no","marks":[]}]}]}]}}}},{"value":"Haus","isCorrect":true,"feedback":{"plugin":"text","state":{"document":{"nodes":[{"object":"block","type":"paragraph","nodes":[{"object":"text","leaves":[{"object":"leaf","text":""}]}]}]}}}},{"value":"Garten","isCorrect":false,"feedback":{"plugin":"text","state":{"document":{"nodes":[{"object":"block","type":"paragraph","nodes":[{"object":"text","leaves":[{"object":"leaf","text":""}]}]}]}}}}]}}}]}'
  )
})

addStory('Plugins/Input Exercise/Prefilled V2', {
  state: JSON.parse(
    '{"plugin":"rows","state":[{"plugin":"inputExercise","state":{"__version__":2,"value":{"type":"input-number-exact-match-challenge","unit":"cm","answers":[{"value":"1,5","isCorrect":true,"feedback":{"plugin":"text","state":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","text":"Sehr gut","marks":[]}]}]}}}},{"value":"2","isCorrect":false,"feedback":{"plugin":"text","state":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","text":"Nein, stimmt nicht.","marks":[]}]}]}}}},{"value":"1","isCorrect":false,"feedback":{"plugin":"text","state":{"document":{"nodes":[{"object":"block","type":"paragraph","nodes":[{"object":"text"}]}]}}}}]}}}]}'
  )
})
