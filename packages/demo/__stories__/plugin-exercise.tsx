import { storiesOf } from '@storybook/react'
import * as React from 'react'

import { EditorStory } from '../src'

storiesOf('Plugins/Exercise', module)
  .add('Initial State', () => {
    const state = {
      plugin: 'rows',
      state: [
        {
          plugin: 'exercise'
        }
      ]
    }
    return <EditorStory initialState={state} />
  })
  .add('Simple example', () => {
    const state = JSON.parse(
      '{"plugin":"rows","state":[{"plugin":"exercise","state":{"question":{"plugin":"rows","state":[{"plugin":"text","state":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"Das ist eine Aufgabenstellung!!","marks":[]}]}]}]}}}]},"solution":{"plugin":"solution","state":{"title":"Name","content":{"plugin":"rows","state":[{"plugin":"text","state":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"Und hier steht die Antwort.","marks":[]}]}]}]}}}]}}}}}]}'
    )
    return <EditorStory initialState={state} />
  })
