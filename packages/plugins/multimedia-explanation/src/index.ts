import {
  boolean,
  BooleanStateType,
  child,
  ChildStateType,
  EditorPlugin,
  EditorPluginProps,
  number,
  NumberStateType,
  object,
  ObjectStateType
} from '@edtr-io/plugin'

import { MultimediaExplanationEditor } from './editor'

/** @public */
export type MultimediaExplanationState = ObjectStateType<{
  explanation: ChildStateType
  multimedia: ChildStateType
  illustrating: BooleanStateType
  width: NumberStateType
}>
/** @public */
export interface MultimediaExplanationConfig {
  explanation: string
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

function createMultimediaExplanationState(
  config: MultimediaExplanationConfig
): MultimediaExplanationState {
  return object({
    explanation: child({ plugin: config.explanation }),
    multimedia: child({ plugin: config.plugins[0].name }),
    illustrating: boolean(true),
    width: number(50) // percent
  })
}

/**
 * @param config - {@link MultimediaExplanationConfig | Plugin configuration}
 * @public
 */
export function createMultimediaExplanationPlugin(
  config: MultimediaExplanationConfig
): EditorPlugin<MultimediaExplanationState, MultimediaExplanationConfig> {
  return {
    Component: MultimediaExplanationEditor,
    config,
    state: createMultimediaExplanationState(config)
  }
}
