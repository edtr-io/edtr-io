import { child, EditorPlugin, EditorPluginProps } from '@edtr-io/plugin'

import { ImportantStatementRenderer } from './renderer'

const importantStatementState = child()
export type ImportantStatementState = typeof importantStatementState
export type ImportantStatementProps = EditorPluginProps<ImportantStatementState>

export function createImportantStatementPlugin(): EditorPlugin<
  ImportantStatementState
> {
  return {
    Component: ImportantStatementRenderer,
    config: {},
    state: importantStatementState
  }
}
