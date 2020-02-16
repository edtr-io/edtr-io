import {
  child,
  ChildStateType,
  EditorPlugin,
  EditorPluginProps
} from '@edtr-io/plugin'

import { BlockquoteRenderer } from './renderer'

/** @public */
export interface BlockquoteStaticConfig {
  content?: Parameters<typeof child>[0]
}

/** @public */
export function createBlockquotePlugin(
  config: BlockquoteStaticConfig = {}
): EditorPlugin<BlockquoteState> {
  return {
    Component: BlockquoteRenderer,
    config: {},
    state: createBlockquotePluginState(config)
  }
}

function createBlockquotePluginState({ content }: BlockquoteStaticConfig) {
  return child(content)
}
/** @public */
export type BlockquoteState = ChildStateType
/** @public */
export type BlockquoteProps = EditorPluginProps<BlockquoteState>
