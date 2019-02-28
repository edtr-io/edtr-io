import { StatefulPluginEditorProps } from '@edtr-io/core'
import SyntaxHighlight from 'react-syntax-highlighter'
import * as React from 'react'

import { highlightState } from '.'

export function HighlightRenderer({
  state
}: StatefulPluginEditorProps<typeof highlightState>) {
  return (
    <SyntaxHighlight
      language={state.value.language.value}
      showLineNumbers={state.value.lineNumbers.value}
    >
      {state.value.text.value ||
        'Switch into edit mode then paste your sourcecode here...'}
    </SyntaxHighlight>
  )
}
