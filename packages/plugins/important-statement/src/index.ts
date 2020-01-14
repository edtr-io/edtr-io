import { child, EditorPlugin, EditorPluginProps } from '@edtr-io/plugin'

import { ImportantStatementRenderer } from './renderer'

/** @public */
export const importantStatementState = child()
/** @public */
export type ImportantStatementState = typeof importantStatementState
/** @public */
export type ImportantStatementProps = EditorPluginProps<ImportantStatementState>

/** @public */
export function createImportantStatementPlugin(): EditorPlugin<
  ImportantStatementState
> {
  return {
    Component: ImportantStatementRenderer,
    config: {},
    state: importantStatementState
  }
}
