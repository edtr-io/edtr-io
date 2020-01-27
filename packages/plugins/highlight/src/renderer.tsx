import * as React from 'react'
import { PrismAsyncLight as SyntaxHighlighter } from 'react-syntax-highlighter'
import style from 'react-syntax-highlighter/dist/cjs/styles/prism/coy'

export function HighlightRenderer(props: HighlightRendererProps) {
  return (
    <SyntaxHighlighter
      language={props.language}
      showLineNumbers={props.showLineNumbers}
      style={style}
      customStyle={{
        overflow: 'auto'
      }}
    >
      {props.code || 'Klicke hier und füg deinen Quellcode ein...'}
    </SyntaxHighlighter>
  )
}

/** @public */
export interface HighlightRendererProps {
  code: string
  language: string
  showLineNumbers: boolean
}
