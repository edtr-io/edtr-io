import { StatefulPlugin, StateType } from '@edtr-io/core'

import { LayoutRenderer } from './editor'

export const layoutState = StateType.list(
  StateType.object({ child: StateType.child(), width: StateType.number() })
)

export const layoutPlugin: StatefulPlugin<typeof layoutState> = {
  Component: LayoutRenderer,
  state: layoutState
}
