import { storiesOf } from '@storybook/react'
import * as React from 'react'

import { EditorStory } from '../src'

storiesOf('Plugins/Important Statement', module)
  .add('Initial State', () => {
    const state = {
      plugin: 'rows',
      state: [{ plugin: 'importantStatement' }]
    }
    return <EditorStory defaultPlugin="text" initialState={state} />
  })
  .add('Prefilled Example', () => {
    const state = JSON.parse(
      '{"plugin":"rows","state":[{"plugin": "importantStatement", "state": {"plugin":"text","state":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"some ","marks":[]}]},{"object":"inline","type":"@splish-me/a","data":{"href":"https://www.example.com"},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"link","marks":[]}]}]},{"object":"text","leaves":[{"object":"leaf","text":", ","marks":[]},{"object":"leaf","text":"bold","marks":[{"object":"mark","type":"@splish-me/strong","data":{}}]},{"object":"leaf","text":" and ","marks":[]},{"object":"leaf","text":"italic","marks":[{"object":"mark","type":"@splish-me/em","data":{}}]},{"object":"leaf","text":" text.  Try using hotkeys for bold (Ctrl / Cmd + B) and italic (Ctrl /Cmd + I) and opening the overlay by selecting a link and pressing Enter key.","marks":[]}]}]}]}}}}]}'
    )

    return <EditorStory defaultPlugin="text" initialState={state} />
  })
  .add('surrounded by text', () => {
    const state = JSON.parse(
      '{"plugin":"rows","state":[{"plugin":"text","state":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"some ","marks":[]}]},{"object":"inline","type":"@splish-me/a","data":{"href":"https://www.example.com"},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"link","marks":[]}]}]},{"object":"text","leaves":[{"object":"leaf","text":", ","marks":[]},{"object":"leaf","text":"bold","marks":[{"object":"mark","type":"@splish-me/strong","data":{}}]},{"object":"leaf","text":" and ","marks":[]},{"object":"leaf","text":"italic","marks":[{"object":"mark","type":"@splish-me/em","data":{}}]},{"object":"leaf","text":" text.  Try using hotkeys for bold (Ctrl / Cmd + B) and italic (Ctrl /Cmd + I) and opening the overlay by selecting a link and pressing Enter key.","marks":[]}]}]}]}}},{"plugin":"importantStatement","state":{"plugin":"text","state":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"some ","marks":[]}]},{"object":"inline","type":"@splish-me/a","data":{"href":"https://www.example.com"},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"link","marks":[]}]}]},{"object":"text","leaves":[{"object":"leaf","text":", ","marks":[]},{"object":"leaf","text":"bold","marks":[{"object":"mark","type":"@splish-me/strong","data":{}}]},{"object":"leaf","text":" and ","marks":[]},{"object":"leaf","text":"italic","marks":[{"object":"mark","type":"@splish-me/em","data":{}}]},{"object":"leaf","text":" text.  Try using hotkeys for bold (Ctrl / Cmd + B) and italic (Ctrl /Cmd + I) and opening the overlay by selecting a link and pressing Enter key.","marks":[]}]}]}]}}}},{"plugin":"text","state":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"some ","marks":[]}]},{"object":"inline","type":"@splish-me/a","data":{"href":"https://www.example.com"},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"link","marks":[]}]}]},{"object":"text","leaves":[{"object":"leaf","text":", ","marks":[]},{"object":"leaf","text":"bold","marks":[{"object":"mark","type":"@splish-me/strong","data":{}}]},{"object":"leaf","text":" and ","marks":[]},{"object":"leaf","text":"italic","marks":[{"object":"mark","type":"@splish-me/em","data":{}}]},{"object":"leaf","text":" text.  Try using hotkeys for bold (Ctrl / Cmd + B) and italic (Ctrl /Cmd + I) and opening the overlay by selecting a link and pressing Enter key.","marks":[]}]}]}]}}}]}'
    )

    return <EditorStory defaultPlugin="text" initialState={state} />
  })
