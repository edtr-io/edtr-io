import { StatefulPlugin, StateType } from '@edtr-io/core'

import { BlockquoteRenderer } from './renderer'

export const blockquoteState = StateType.child()

export const blockquotePlugin: StatefulPlugin<typeof blockquoteState> = {
  Component: BlockquoteRenderer,
  state: blockquoteState
}
