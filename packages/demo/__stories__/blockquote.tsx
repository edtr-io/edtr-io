import { createDocument, Editor, Plugin } from '@edtr-io/core'
import { blockquotePlugin } from '@edtr-io/plugin-blockquote'
import { storiesOf } from '@storybook/react'
import * as React from 'react'

const plugins: Record<string, Plugin<any>> = { blockquote: blockquotePlugin }

storiesOf('BlockquotePlugin', module).add('Empty example', () => {
  const state = createDocument({
    plugin: 'blockquote'
  })
  return <Editor plugins={plugins} defaultPlugin="blockquote" state={state} />
})
