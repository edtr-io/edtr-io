import { EditorPlugin, EditorPluginProps, string } from '@edtr-io/plugin'
import * as React from 'react'
import ReactMarkdown from 'react-markdown'

import { TableEditor } from './editor'

const tableState = string()
export type TableState = typeof tableState
export interface TableConfig {
  MarkdownRenderer: React.ComponentType<{ markdown: string }>
}
export type TableProps = EditorPluginProps<TableState, TableConfig>

export function createTablePlugin(
  config: TableConfig = {
    MarkdownRenderer: DefaultMarkdownRenderer
  }
): EditorPlugin<TableState, TableConfig> {
  return {
    Component: TableEditor,
    config,
    state: tableState
  }
}

function DefaultMarkdownRenderer({ markdown }: { markdown: string }) {
  return <ReactMarkdown source={markdown} />
}
