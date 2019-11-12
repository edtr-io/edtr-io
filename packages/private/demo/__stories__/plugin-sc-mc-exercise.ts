import { addStory } from '../src'

addStory('Plugins/Single-Choice-Multiple-Choice Exercise/Initial State', {
  state: {
    plugin: 'rows',
    state: [
      {
        plugin: 'scMcExercise'
      }
    ]
  }
})

addStory('Plugins/Single-Choice-Multiple-Choice Exercise/Prefilled', {
  state: JSON.parse(
    '{"plugin":"rows","state":[{"plugin":"text","state":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"Hier könnte Ihre Frage stehen:","marks":[]}]}]}]}}},{"plugin":"scMcExercise","state":{"isSingleChoice":false,"answers":[{"id":{"plugin":"text","state":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"42","marks":[]}]}]}]}}},"isCorrect":true,"feedback":{"plugin":"text","state":{"document":{"nodes":[{"object":"block","type":"paragraph","nodes":[{"object":"text","leaves":[{"object":"leaf","text":""}]}]}]}}},"hasFeedback":false},{"id":{"plugin":"text","state":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"1","marks":[]}]}]}]}}},"isCorrect":false,"feedback":{"plugin":"text","state":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"Viel zu wenig!!","marks":[]}]}]}]}}},"hasFeedback":true},{"id":{"plugin":"text","state":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"2","marks":[]}]}]}]}}},"isCorrect":false,"feedback":{"plugin":"text","state":{"document":{"nodes":[{"object":"block","type":"paragraph","nodes":[{"object":"text","leaves":[{"object":"leaf","text":""}]}]}]}}},"hasFeedback":false}]}}]}'
  )
})
