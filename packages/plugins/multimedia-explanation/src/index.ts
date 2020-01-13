import {
  boolean,
  child,
  EditorPlugin,
  EditorPluginProps,
  number,
  object
} from '@edtr-io/plugin'

import { MultimediaExplanationEditor } from './editor'

/**
 * @param config - {@link MultimediaExplanationConfig | Plugin configuration}
 * @public
 */
export const createMultimediaExplanationState = (
  config: MultimediaExplanationConfig
) =>
  object({
    explanation: child({ plugin: 'rows' }),
    multimedia: child({ plugin: config.plugins[0].name }),
    illustrating: boolean(true),
    width: number(50) // percent
  })
/** @public */
export type MultimediaExplanationState = ReturnType<
  typeof createMultimediaExplanationState
>
/** @public */
export interface MultimediaExplanationConfig {
  plugins: {
    name: string
    title: string
  }[]
}
/** @public */
export type MultimediaExplanationProps = EditorPluginProps<
  MultimediaExplanationState,
  MultimediaExplanationConfig
>

/**
 * @param config - {@link MultimediaExplanationConfig | Plugin configuration}
 * @public
 */
export const createMultimediaExplanationPlugin = (
  config: MultimediaExplanationConfig
): EditorPlugin<MultimediaExplanationState, MultimediaExplanationConfig> => {
  return {
    Component: MultimediaExplanationEditor,
    config,
    state: createMultimediaExplanationState(config)
  }
}
