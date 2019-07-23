import SyntaxHighlight from 'react-syntax-highlighter'
import * as React from 'react'

export function HighlightRenderer(props: HighlightRendererProps) {
  return (
    <SyntaxHighlight
      language={props.language}
      showLineNumbers={props.lineNumbers}
    >
      {props.code ||
        'Switch into edit mode then paste your sourcecode here...'}
    </SyntaxHighlight>
  )
}

export interface HighlightRendererProps {
  code: string,
  language: string,
  lineNumbers: boolean
}