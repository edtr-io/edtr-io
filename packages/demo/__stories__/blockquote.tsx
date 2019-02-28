import { createDocument, Editor, Plugin } from '@edtr-io/core'
import { blockquotePlugin } from '@edtr-io/plugin-blockquote'
import { storiesOf } from '@storybook/react'
import * as React from 'react'
import { textPlugin } from '@edtr-io/plugin-text'

const plugins: Record<string, Plugin<any>> = {
  blockquote: blockquotePlugin,
  text: textPlugin
}

storiesOf('BlockquotePlugin', module).add('Empty example', () => {
  const state = createDocument({
    plugin: 'blockquote'
  })
  return <Editor plugins={plugins} defaultPlugin="text" state={state} />
})
