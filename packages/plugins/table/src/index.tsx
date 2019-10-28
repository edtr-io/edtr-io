import { StatefulPlugin, string } from '@edtr-io/plugin'
import * as React from 'react'
import ReactMarkdown from 'react-markdown'

import { TableEditor } from './editor'

export const tableState = string()

export function createTablePlugin(
  renderMarkdown = defaultRenderMarkdown
): StatefulPlugin<typeof tableState, TablePluginConfig> {
  return {
    Component: TableEditor,
    config: {
      renderMarkdown
    },
    state: tableState,
    title: 'Tabelle',
    description: 'Erstelle eine Tabelle mit Markdown.'
  }
}

function defaultRenderMarkdown(markdown: string): React.ReactNode {
  return <ReactMarkdown source={markdown} />
}

export interface TablePluginConfig {
  renderMarkdown: (markdown: string) => string | React.ReactNode
}
