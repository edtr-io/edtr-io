import * as React from 'react'
import { PrismAsyncLight as SyntaxHighlighter } from 'react-syntax-highlighter'
// eslint-disable-next-line import/no-internal-modules
import style from 'react-syntax-highlighter/dist/esm/styles/prism/coy'

export function HighlightRenderer(props: HighlightRendererProps) {
  return (
    <SyntaxHighlighter
      language={props.language}
      showLineNumbers={props.lineNumbers}
      style={style}
      customStyle={{
        overflow: 'auto'
      }}
    >
      {props.code || 'Klicke hier und füg deinen Quellcode ein...'}
    </SyntaxHighlighter>
  )
}

export interface HighlightRendererProps {
  code: string
  language: string
  lineNumbers: boolean
}
