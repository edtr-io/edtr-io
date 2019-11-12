import { addStory } from '../src'

addStory('Plugins/Blockquote/Initial State', {
  state: {
    plugin: 'rows',
    state: [
      {
        plugin: 'blockquote',
        state: {
          plugin: 'text'
        }
      }
    ]
  }
})

addStory('Plugins/Blockquote/Prefilled', {
  state: JSON.parse(
    '{"plugin":"rows","state":[{"plugin":"text","state":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"Hier ist ein Beispiel für ein nichtleeres Zitat:","marks":[]}]}]}]}}},{"plugin":"blockquote","state":{"plugin":"text","state":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"Dies ist ein Blockquote/Zitat. Sein aussehen ist abhängig vom Theming","marks":[]}]}]},{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"Cupcake ipsum dolor sit amet croissant","marks":[]}]}]}]}}}},{"plugin":"text","state":{"document":{"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"","marks":[]}]}]}]}}}]}'
  )
})
