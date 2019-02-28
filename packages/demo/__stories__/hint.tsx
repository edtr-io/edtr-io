import { createDocument, Editor, Plugin } from '@edtr-io/core'
import { hintPlugin } from '@edtr-io/plugin-hint'
import { blockquotePlugin } from '@edtr-io/plugin-blockquote'
import { storiesOf } from '@storybook/react'
import * as React from 'react'

const plugins: Record<string, Plugin<any>> = {
  hint: hintPlugin,
  blockquote: blockquotePlugin
}

storiesOf('HintPlugin', module).add('Empty example', () => {
  const state = createDocument({
    plugin: 'hint'
  })
  return <Editor plugins={plugins} defaultPlugin="blockquote" state={state} />
})
