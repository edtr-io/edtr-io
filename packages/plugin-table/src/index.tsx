import { string, StatefulPlugin } from '@edtr-io/plugin'
import * as React from 'react'
import ReactMarkdown from 'react-markdown'

import { createTableEditor } from './editor'

export const tableState = string()

export function createTablePlugin(
  config: TablePluginConfig
): StatefulPlugin<typeof tableState> {
  return {
    Component: createTableEditor(config),
    state: tableState,
    title: 'Tabelle',
    description: 'Erstelle eine Tabelle mit Markdown.'
  }
}

export const tablePlugin = createTablePlugin({
  renderMarkdown: function RenderMarkdown(markdown) {
    return <ReactMarkdown source={markdown} />
  }
})

export interface TablePluginConfig {
  renderMarkdown: (markdown: string) => string | React.ReactNode
}
