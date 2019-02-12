import * as React from 'react'
import { createDocument, Editor, Plugin } from '@edtr-io/core'
import { storiesOf } from '@storybook/react'
import { textPlugin } from '@edtr-io/plugin-text'
import { Overlay, rowsPlugin } from '@edtr-io/ui'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const plugins: Record<string, Plugin<any>> = {
  text: textPlugin,
  rows: rowsPlugin
}

storiesOf('TextPlugin', module).add('Basic example', () => {
  const state = createDocument({
    plugin: 'rows'
  })

  return (
    <Editor plugins={plugins} defaultPlugin="text" state={state}>
      <Overlay />
    </Editor>
  )
})
