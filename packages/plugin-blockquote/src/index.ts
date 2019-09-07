import { createIcon, faQuoteRight } from '@edtr-io/editor-ui'
import { child, StatefulPlugin } from '@edtr-io/plugin'

import { BlockquoteRenderer } from './renderer'

export const blockquoteState = child()

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
