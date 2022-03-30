import * as React from 'react'
import { PrismAsyncLight as SyntaxHighlighter } from 'react-syntax-highlighter'
import style from 'react-syntax-highlighter/dist/cjs/styles/prism/coy'

import { HighlightConfig } from '.'
import { useHighlightConfig } from './config'

export function HighlightRenderer(props: HighlightRendererProps) {
  const { i18n } = useHighlightConfig(props.config)

  return (
    <SyntaxHighlighter
      language={props.language}
      showLineNumbers={props.showLineNumbers}
      style={style}
      customStyle={{
        overflow: 'auto',
      }}
    >
      {props.code || i18n.code.label}
    </SyntaxHighlighter>
  )
}

/** @public */
export interface HighlightRendererProps {
  config: HighlightConfig
  code: string
  language: string
  showLineNumbers: boolean
}
