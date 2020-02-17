import * as React from 'react'
import { PrismAsyncLight as SyntaxHighlighter } from 'react-syntax-highlighter'
import style from 'react-syntax-highlighter/dist/cjs/styles/prism/coy'

import { HighlightPluginConfig } from '.'

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
      {props.code || props.config.i18n.code.label}
    </SyntaxHighlighter>
  )
}

/** @public */
export interface HighlightRendererProps {
  config: HighlightPluginConfig
  code: string
  language: string
  showLineNumbers: boolean
}
