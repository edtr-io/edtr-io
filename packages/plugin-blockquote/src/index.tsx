import { BlockquoteRenderer } from './renderer'
import { StatefulPlugin, StateType } from '@edtr-io/core'

export const blockquoteState = StateType.child()
export const blockquotePlugin: StatefulPlugin<typeof blockquoteState> = {
  Component: BlockquoteRenderer,
  state: blockquoteState
}
