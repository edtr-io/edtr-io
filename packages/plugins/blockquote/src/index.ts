import { child, EditorPlugin } from '@edtr-io/plugin'

import { BlockquoteRenderer } from './renderer'

export type BlockquotePluginState = ReturnType<typeof child>

export function createBlockquotePlugin({
  content = []
}: { content?: Parameters<typeof child> } = {}): EditorPlugin<
  BlockquotePluginState
> {
  return {
    Component: BlockquoteRenderer,
    config: {},
    state: child(...content)
  }
}
