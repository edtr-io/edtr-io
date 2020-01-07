import {
  boolean,
  child,
  EditorPlugin,
  EditorPluginProps,
  number,
  object
} from '@edtr-io/plugin'

import { MultimediaExplanationEditor } from './editor'

const createMultimediaExplanationState = (
  config: MultimediaExplanationConfig
) =>
  object({
    explanation: child({ plugin: 'rows' }),
    multimedia: child({ plugin: config.plugins[0].name }),
    illustrating: boolean(true),
    width: number(50) // percent
  })
export type MultimediaExplanationState = ReturnType<
  typeof createMultimediaExplanationState
>
export interface MultimediaExplanationConfig {
  plugins: {
    name: string
    title: string
  }[]
}
export type MultimediaExplanationProps = EditorPluginProps<
  MultimediaExplanationState,
  MultimediaExplanationConfig
>

export const createMultimediaExplanationPlugin = (
  config: MultimediaExplanationConfig
): EditorPlugin<MultimediaExplanationState, MultimediaExplanationConfig> => {
  return {
    Component: MultimediaExplanationEditor,
    config,
    state: createMultimediaExplanationState(config)
  }
}
