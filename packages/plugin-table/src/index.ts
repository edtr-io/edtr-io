import { StatefulPlugin, StateType } from '@edtr-io/core'

import { TableEditor } from './editor'

export const tableState = StateType.string()

export const tablePlugin: StatefulPlugin<typeof tableState> = {
  Component: TableEditor,
  state: tableState,
  title: 'Tabelle',
  description: 'Erstelle eine Tabelle mit Markdown',
  onKeyDown: (e: KeyboardEvent) => {
    const { key } = e
    return !['ArrowDown', 'ArrowUp', 'Enter'].includes(key)
  }
}
