import * as React from 'react'
import { createDocument } from '@edtr-io/core'
import { storiesOf } from '@storybook/react'
import { Story } from '.'

storiesOf('Text Plugin', module)
  .add('Empty example', () => {
    const state = createDocument({
      plugin: 'rows'
    })

    return <Story defaultPlugin="text" state={state} />
  })
  .add('Prefilled', () => {
    const state = createDocument(
      JSON.parse(
        '{"type":"@edtr-io/document","plugin":"rows","state":[{"type":"@edtr-io/document","plugin":"text","state":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"some ","marks":[]}]},{"object":"inline","type":"@splish-me/a","data":{"href":"https://www.example.com"},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"link","marks":[]}]}]},{"object":"text","leaves":[{"object":"leaf","text":", ","marks":[]},{"object":"leaf","text":"bold","marks":[{"object":"mark","type":"@splish-me/strong","data":{}}]},{"object":"leaf","text":" and ","marks":[]},{"object":"leaf","text":"italic","marks":[{"object":"mark","type":"@splish-me/em","data":{}}]},{"object":"leaf","text":" text.  Try using hotkeys for bold (Ctrl / Cmd + B) and italic (Ctrl /Cmd + I) and opening the overlay by selecting a link and pressing Enter key.","marks":[]}]}]}]}}}]}'
      )
    )

    return <Story defaultPlugin="text" state={state} />
  })
