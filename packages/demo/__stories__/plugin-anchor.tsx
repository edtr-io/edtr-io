import { storiesOf } from '@storybook/react'
import * as React from 'react'

import { EditorStory } from '../src'

storiesOf('Plugins/Anchor', module)
  .add('Initial State', () => {
    const state = {
      plugin: 'rows'
    }
    return <EditorStory defaultPlugin="anchor" initialState={state} />
  })
  .add('Prefilled Example', () => {
    const state = JSON.parse(
      '{"plugin":"rows","state":[{"plugin":"anchor","state":"1"},{"plugin":"image","state":{"src":"https://assets.serlo.org/legacy/7664_1dHc78l5oT.png","href":"","target":"","rel":"","description":"sdfsafdd"}},{"plugin":"text","state":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"fsdafsadf","marks":[]}]}]}]}}},{"plugin":"text","state":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"sdafsdafsdaf","marks":[]}]}]}]}}},{"plugin":"text","state":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"sdafsdafsadf","marks":[]}]}]}]}}},{"plugin":"text","state":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"asfsadf","marks":[]}]}]}]}}},{"plugin":"text","state":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"dasfdsafsdaf","marks":[]}]}]}]}}},{"plugin":"text","state":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"sdafsdafsda","marks":[]}]}]}]}}},{"plugin":"text","state":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"sdafsdafsdaf","marks":[]}]}]}]}}},{"plugin":"text","state":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"dsafsdaf","marks":[]}]}]}]}}},{"plugin":"text","state":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"sdafsadfsdaf","marks":[]}]}]}]}}},{"plugin":"text","state":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"dsfasdfsdaf","marks":[]}]}]}]}}},{"plugin":"text","state":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"dsafasdfsdaf","marks":[]}]}]}]}}},{"plugin":"text","state":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"","marks":[]}]},{"object":"inline","type":"@splish-me/a","data":{"href":"http://localhost:9001/?path=/story/plugins-anchor--initial-state#1"},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"\\nTest ","marks":[]}]}]},{"object":"text","leaves":[{"object":"leaf","text":"","marks":[]}]}]}]}}}]}'
    )

    return <EditorStory defaultPlugin="text" initialState={state} />
  })
