import { createDocument, Editor, Plugin } from '@edtr-io/core'
import { anchorPlugin } from '@edtr-io/plugin-anchor'
import { storiesOf } from '@storybook/react'
import * as React from 'react'

const plugins: Record<string, Plugin<any>> = { anchor: anchorPlugin }

storiesOf('AnchorPlugin', module)
  .add('Empty example', () => {
    const state = createDocument({
      plugin: 'anchor'
    })
    return <Editor plugins={plugins} defaultPlugin="anchor" state={state} />
  })
  .add('Renderer', () => {
    const state = createDocument({
      plugin: 'anchor'
    })
    return <Editor plugins={plugins} defaultPlugin="anchor" state={state} />
  })
