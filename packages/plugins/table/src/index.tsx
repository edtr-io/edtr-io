import {
  EditorPlugin,
  EditorPluginProps,
  string,
  StringStateType
} from '@edtr-io/plugin'
import * as React from 'react'
import ReactMarkdown from 'react-markdown'

import { TableEditor } from './editor'

/** @public */
export type TableState = StringStateType
/** @public */
export interface TableConfig {
  MarkdownRenderer: React.ComponentType<{ markdown: string }>
}
/** @public */
export type TableProps = EditorPluginProps<TableState, TableConfig>

const tableState: StringStateType = string()

/**
 * @param config - {@link TableConfig | Plugin configuration}
 * @public
 */
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
