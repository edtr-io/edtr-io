import * as React from 'react'
import {
  createDocumentIdentifier,
  Document,
  EditorProvider,
  Plugin
} from '@edtr-io/core'
import { storiesOf } from '@storybook/react'
import { textPlugin } from '@edtr-io/plugin-text'
import { rowsPlugin } from '@edtr-io/ui'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const plugins: Record<string, Plugin<any>> = {
  text: textPlugin,
  rows: rowsPlugin
}

storiesOf('TextPlugin', module).add('Basic example', () => {
  const state = createDocumentIdentifier({
    plugin: 'rows'
  })

  return (
    <EditorProvider plugins={plugins} defaultPlugin="text">
      <Document state={state} />
    </EditorProvider>
  )
})
