import { child, StatefulPlugin } from '@edtr-io/plugin'

import { ImportantStatementRenderer } from './renderer'

export const importantStatementState = child()

export const importantStatementPlugin: StatefulPlugin<
  typeof importantStatementState
> = {
  Component: ImportantStatementRenderer,
  state: importantStatementState,
  title: 'Merksatz'
}
