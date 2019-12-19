import { child, Plugin } from '@edtr-io/plugin'

import { ImportantStatementRenderer } from './renderer'

export const importantStatementState = child()

export const importantStatementPlugin: Plugin<
  typeof importantStatementState
> = {
  Component: ImportantStatementRenderer,
  state: importantStatementState,
  title: 'Merksatz'
}
