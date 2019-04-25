import { storiesOf } from '@storybook/react'
import * as React from 'react'

import { EditorStory } from '../src'

storiesOf('Plugins/Hint', module)
  .add('Initial State', () => {
    const state = {
      plugin: 'hint'
    }
    return <EditorStory initialState={state} />
  })
  .add('Example', () => {
    const state = JSON.parse(
      '{"plugin":"rows","state":[{"plugin":"hint","state":{"title":"(erster Tipp)","content":{"plugin":"text","state":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"Dies ist ein Hinweis. Er hilft, wenn man nicht sofort die gesamte Lösung sehen will. ","marks":[]}]}]},{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"","marks":[]}]}]}]}}}}}]}'
    )
    return <EditorStory initialState={state} />
  })
