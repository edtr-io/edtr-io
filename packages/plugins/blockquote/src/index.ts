import { child, EditorPlugin, EditorPluginProps } from '@edtr-io/plugin'

import { BlockquoteRenderer } from './renderer'

export function createBlockquotePlugin({
  content = []
}: { content?: Parameters<typeof child> } = {}): EditorPlugin<BlockquoteState> {
  return {
    Component: BlockquoteRenderer,
    config: {},
    state: createBlockquotePluginState(content)
  }
}

function createBlockquotePluginState(content: Parameters<typeof child>) {
  return child(...content)
}
export type BlockquoteState = ReturnType<typeof child>
export type BlockquoteProps = EditorPluginProps<BlockquoteState>
