import { StatefulPlugin, StateType } from '@edtr-io/core'

import { BlockquoteRenderer } from './renderer'
import { createIcon, faQuoteRight } from '@edtr-io/editor-ui'

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
