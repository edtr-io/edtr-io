import { child, StatefulPlugin } from '@edtr-io/plugin'
import { createIcon, faQuoteRight } from '@edtr-io/ui'

import { BlockquoteRenderer } from './renderer'

function createBlockquoteState(content: Parameters<typeof child>) {
  return child(...content)
}
export type BlockquotePluginState = ReturnType<typeof createBlockquoteState>

export function createBlockquotePlugin({
  content = []
}: { content?: Parameters<typeof child> } = {}): StatefulPlugin<
  BlockquotePluginState
> {
  return {
    Component: BlockquoteRenderer,
    config: {},
    state: createBlockquoteState(content),
    title: 'Zitat',
    description: 'Erzeuge eingerückten Text, zum Beispiel für Zitate.',
    icon: createIcon(faQuoteRight)
  }
}
