import * as React from 'react'
import SyntaxHighlight from 'react-syntax-highlighter'

export class HighlightRenderer extends React.Component<HighlightRendererProps> {
  render() {
    const { state } = this.props

    return (
      <SyntaxHighlight
        language={state.value.language.value || 'text'}
        showLineNumbers={state.value.lineNumbers.value || false}
      >
        {state.value.text.value ||
          'Switch into edit mode then paste your sourcecode here...'}
      </SyntaxHighlight>
    )
  }
}

export interface HighlightRendererProps {
  //TODO
  state: any
}
