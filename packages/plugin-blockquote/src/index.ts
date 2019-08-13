import { StatefulPlugin, StateType } from '@edtr-io/core'
import { createIcon, faQuoteRight } from '@edtr-io/editor-ui'

import { BlockquoteRenderer } from './renderer'

export const blockquoteState = StateType.child()

export const blockquotePlugin: StatefulPlugin<typeof blockquoteState> = {
  Component: BlockquoteRenderer,
  state: blockquoteState,
  title: 'Zitat',
  description: 'Erzeuge eingerückten Text, zum Beispiel für Zitate.',
  getFocusableChildren(state) {
    return [state]
  },
  icon: createIcon(faQuoteRight)
}
