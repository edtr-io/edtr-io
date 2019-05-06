import { storiesOf } from '@storybook/react'
import * as React from 'react'

import { EditorStory } from '../src'

storiesOf('Plugins/Input Exercise', module)
  .add('Initial State', () => {
    const state = {
      plugin: 'rows',
      state: [
        {
          plugin: 'inputExercise'
        }
      ]
    }
    return <EditorStory initialState={state} />
  })
  .add('Prefilled Example', () => {
    const state = JSON.parse(
      '{"plugin":"rows","state":[{"plugin":"text","state":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"Hier könnte Ihre Frage stehen:","marks":[]}]}]}]}}},{"plugin":"inputExercise","state":{"type":"Text","correctAnswers":["42"],"wrongAnswers":[{"value":"1","feedback":"zu niedrig!"},{"value":"2","feedback":"immer noch zu niedrig!"}]}}]}'
    )

    return <EditorStory defaultPlugin="text" initialState={state} />
  })
