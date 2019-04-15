import * as React from 'react'
import { storiesOf } from '@storybook/react'

import { EditorStory } from '../src'

storiesOf('Plugins/Text', module)
  .add('Initial State', () => {
    const state = {
      plugin: 'rows'
    }

    return <EditorStory defaultPlugin="text" initialState={state} />
  })
  .add('Prefilled', () => {
    const state = JSON.parse(
      '{"plugin":"rows","state":[{"plugin":"text","state":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"some ","marks":[]}]},{"object":"inline","type":"@splish-me/a","data":{"href":"https://www.example.com"},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"link","marks":[]}]}]},{"object":"text","leaves":[{"object":"leaf","text":", ","marks":[]},{"object":"leaf","text":"bold","marks":[{"object":"mark","type":"@splish-me/strong","data":{}}]},{"object":"leaf","text":" and ","marks":[]},{"object":"leaf","text":"italic","marks":[{"object":"mark","type":"@splish-me/em","data":{}}]},{"object":"leaf","text":" text.  Try using hotkeys for bold (Ctrl / Cmd + B) and italic (Ctrl /Cmd + I) and opening the overlay by selecting a link and pressing Enter key.","marks":[]}]}]}]}}}]}'
    )

    return <EditorStory defaultPlugin="text" initialState={state} />
  })
  .add('Prefilled with math', () => {
    const state = JSON.parse(
      '{"plugin":"rows","state":[{"plugin":"text","state":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"some ","marks":[]}]},{"object":"inline","type":"@splish-me/a","data":{"href":"https://www.example.com"},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"link","marks":[]}]}]},{"object":"text","leaves":[{"object":"leaf","text":", ","marks":[]},{"object":"leaf","text":"bold","marks":[{"object":"mark","type":"@splish-me/strong","data":{}}]},{"object":"leaf","text":" and ","marks":[]},{"object":"leaf","text":"italic","marks":[{"object":"mark","type":"@splish-me/em","data":{}}]},{"object":"leaf","text":" text.  Try using hotkeys for bold (Ctrl / Cmd + B) and italic (Ctrl /Cmd + I) and opening the overlay by selecting a link and pressing Enter key.","marks":[]}]}]}]}}},{"plugin":"text","state":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"Also look at this beautiful formula: ","marks":[]}]},{"object":"inline","type":"@splish-me/katex-inline","data":{"formula":"f(x) = \\\\int_{-\\\\infty}^\\\\infty\\n    \\\\hat f(\\\\xi)\\\\,e^{2 \\\\pi i \\\\xi x} \\n    \\\\,d\\\\xi","inline":true},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"","marks":[]}]}]},{"object":"text","leaves":[{"object":"leaf","text":"","marks":[]}]}]}]}}}]}'
    )

    return <EditorStory defaultPlugin="text" initialState={state} />
  })
