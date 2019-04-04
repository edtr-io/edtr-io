import { storiesOf } from '@storybook/react'
import * as React from 'react'

import { EditorStory } from '../src'

storiesOf('Plugins/Blockquote', module)
  .add('Initial State', () => {
    const state = JSON.parse(
      '{"plugin":"rows","state":[{"plugin":"text","state":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"Hier ist ein Beispiel für ein leeres Zitat:","marks":[]}]}]}]}}},{"plugin":"blockquote","state":{"plugin":"text","state":{"document":{"nodes":[{"object":"block","type":"paragraph","nodes":[{"object":"text","leaves":[{"object":"leaf","text":""}]}]}]}}}},{"plugin":"text","state":{"document":{"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"","marks":[]}]}]}]}}}]}'
    )
    return <EditorStory defaultPlugin="text" initialState={state} />
  })
  .add('Prefilled Example', () => {
    const state = JSON.parse(
      '{"plugin":"rows","state":[{"plugin":"text","state":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"Hier ist ein Beispiel für ein leeres Zitat:","marks":[]}]}]}]}}},{"plugin":"blockquote","state":{"plugin":"text","state":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"Dies ist ein Blockquote/Zitat. Es ist eingerückt","marks":[]}]}]},{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"Bdspiofhaweüthifesfd","marks":[]}]}]},{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"sreatweaftgrv","marks":[]}]}]},{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"retefgetsea","marks":[]}]}]},{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"","marks":[]}]}]}]}}}},{"plugin":"text","state":{"document":{"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"","marks":[]}]}]}]}}}]}'
    )

    return <EditorStory defaultPlugin="text" initialState={state} />
  })
