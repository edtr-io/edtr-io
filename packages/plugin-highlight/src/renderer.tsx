import { StatefulPluginEditorProps } from '@edtr-io/core'
import * as React from 'react'
import SyntaxHighlight from 'react-syntax-highlighter'

import { highlightState } from '.'

export function HighlightRenderer({
  state
}: StatefulPluginEditorProps<typeof highlightState>) {
  return (
    <SyntaxHighlight
      language={state.language.value}
      showLineNumbers={state.lineNumbers.value}
    >
      {state.text.value ||
        'Switch into edit mode then paste your sourcecode here...'}
    </SyntaxHighlight>
  )
}
