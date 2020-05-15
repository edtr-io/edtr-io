import {
  EditorPlugin,
  EditorPluginProps,
  string,
  StringStateType,
} from '@edtr-io/plugin'
import * as React from 'react'
import ReactMarkdown from 'react-markdown'

import { TableEditor } from './editor'

/**
 * @param config - {@link TableConfig | Plugin configuration}
 * @public
 */
export function createTablePlugin(
  config: TableConfig = {}
): EditorPlugin<TablePluginState, TablePluginConfig> {
  const { i18n = {}, MarkdownRenderer = DefaultMarkdownRenderer } = config

  return {
    Component: TableEditor,
    config: {
      i18n: {
        placeholder: 'Enter the table using Markdown syntax',
        ...i18n,
      },
      MarkdownRenderer,
    },
    state: string(),
  }

  function DefaultMarkdownRenderer({ markdown }: { markdown: string }) {
    return <ReactMarkdown source={markdown} />
  }
}

/** @public */
export interface TableConfig {
  i18n?: Partial<TablePluginConfig['i18n']>
  MarkdownRenderer?: TablePluginConfig['MarkdownRenderer']
}

/** @public */
export type TablePluginState = StringStateType

/** @public */
export interface TablePluginConfig {
  i18n: {
    placeholder: string
  }
  MarkdownRenderer: React.ComponentType<{ markdown: string }>
}

/** @public */
export type TableProps = EditorPluginProps<TablePluginState, TablePluginConfig>
