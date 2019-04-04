import { storiesOf } from '@storybook/react'
import * as React from 'react'

import { EditorStory } from '../src'

storiesOf('Plugins/Input Exercise', module)
  .add('Initial State', () => {
    const state = JSON.parse(
      '{"plugin":"rows","state":[{"plugin":"inputExercise","state":{"type":"Text","correctAnswers":[],"wrongAnswers":[]}}]}'
    )
    return <EditorStory initialState={state} />
  })
  .add('Prefilled Example', () => {
    const state = JSON.parse(
      '{"plugin":"rows","state":[{"plugin":"text","state":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"Hier könnte Ihre Frage stehen:","marks":[]}]}]}]}}},{"plugin":"inputExercise","state":{"type":"Text","correctAnswers":["42"],"wrongAnswers":[{"value":"1","feedback":{"plugin":"text","state":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"Viel zu wenig!!","marks":[]}]}]}]}}}},{"value":"2","feedback":{"plugin":"text","state":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"s.o.","marks":[{"object":"mark","type":"@splish-me/strong","data":{}}]}]}]}]}}}}]}}]}'
    )

    return <EditorStory defaultPlugin="text" initialState={state} />
  })
