import {
  child,
  ChildStateType,
  ChildStateTypeConfig,
  EditorPlugin,
  EditorPluginProps
} from '@edtr-io/plugin'

import { BlockquoteRenderer } from './renderer'

/** @public */
export interface BlockquoteStaticConfig {
  content?: ChildStateTypeConfig
}

/**
 * @param config - Config
 * @public
 */
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
