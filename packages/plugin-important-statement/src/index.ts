import { StatefulPlugin, StateType } from '@edtr-io/core'

import { ImportantStatementRenderer } from './renderer'

export const importantStatementState = StateType.child()

export const importantStatementPlugin: StatefulPlugin<
  typeof importantStatementState
> = {
  Component: ImportantStatementRenderer,
  state: importantStatementState,
  title: 'Merksatz',
  description: 'Hebe eine wichtige Information durch einen Merksatz hervor',
  getFocusableChildren(state) {
    return [state]
  }
}
