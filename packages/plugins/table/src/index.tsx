import { EditorPlugin, EditorPluginProps, string } from '@edtr-io/plugin'
import * as React from 'react'
import ReactMarkdown from 'react-markdown'

import { TableEditor } from './editor'

/** @public */
export const tableState = string()
/** @public */
export type TableState = typeof tableState
/** @public */
export interface TableConfig {
  MarkdownRenderer: React.ComponentType<{ markdown: string }>
}
/** @public */
export type TableProps = EditorPluginProps<TableState, TableConfig>

/** @public */
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
