import { child, StatefulPlugin } from '@edtr-io/plugin'

import { ImportantStatementRenderer } from './renderer'

export const importantStatementState = child()

export function createImportantStatementPlugin(): StatefulPlugin<
  typeof importantStatementState
> {
  return {
    Component: ImportantStatementRenderer,
    config: {},
    state: importantStatementState,
    title: 'Merksatz'
  }
}
