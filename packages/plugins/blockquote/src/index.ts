import {
  child,
  ChildStateType,
  ChildStateTypeConfig,
  EditorPlugin,
  EditorPluginProps,
} from '@edtr-io/plugin'

import { BlockquoteRenderer } from './renderer'

/**
 * @param config - {@link BlockquoteConfig | Plugin configuration}
 * @public
 */
export function createBlockquotePlugin(
  config: BlockquoteConfig
): EditorPlugin<BlockquotePluginState> {
  return {
    Component: BlockquoteRenderer,
    config: {},
    state: createState(),
  }

  function createState() {
    return child(config.content)
  }
}

/** @public */
export interface BlockquoteConfig {
  content: ChildStateTypeConfig
}

/** @public */
export type BlockquotePluginState = ChildStateType

/** @public */
export type BlockquoteProps = EditorPluginProps<BlockquotePluginState>
