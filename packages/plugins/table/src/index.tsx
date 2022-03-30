import {
  EditorPlugin,
  EditorPluginProps,
  string,
  StringStateType,
} from '@edtr-io/plugin'
import * as React from 'react'

import { TableEditor } from './editor'

/**
 * @param config - {@link TableConfig | Plugin configuration}
 * @public
 */
export function createTablePlugin(
  config: TableConfig = {}
): EditorPlugin<TablePluginState, TableConfig> {
  return {
    Component: TableEditor,
    config,
    state: string(),
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
export type TableProps = EditorPluginProps<TablePluginState, TableConfig>
