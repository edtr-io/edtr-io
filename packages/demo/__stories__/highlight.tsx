import { createDocument, Editor, Plugin } from '@edtr-io/core'
import { highlightPlugin } from '@edtr-io/plugin-highlight'
import { storiesOf } from '@storybook/react'
import * as React from 'react'

const plugins: Record<string, Plugin<any>> = { highlight: highlightPlugin }

storiesOf('HighlightPlugin', module)
  .add('Empty example', () => {
    const state = createDocument({
      plugin: 'highlight'
    })
    return <Editor plugins={plugins} defaultPlugin="highlight" state={state} />
  })
  .add('Renderer', () => {
    const state = createDocument({
      plugin: 'highlight'
    })
    return <Editor plugins={plugins} defaultPlugin="highlight" state={state} />
  })
