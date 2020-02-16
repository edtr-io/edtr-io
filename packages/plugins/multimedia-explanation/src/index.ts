import {
  boolean,
  BooleanStateType,
  child,
  ChildStateType,
  ChildStateTypeConfig,
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
  plugins: {
    name: string
    title: string
  }[]
}
/** @public */
export interface MultimediaExplanationStaticConfig {
  explanation?: ChildStateTypeConfig
}
/** @public */
export type MultimediaExplanationProps = EditorPluginProps<
  MultimediaExplanationState,
  MultimediaExplanationConfig
>

function createMultimediaExplanationState(
  config: MultimediaExplanationStaticConfig & MultimediaExplanationConfig
): MultimediaExplanationState {
  return object({
    explanation: child(config.explanation),
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
  config: MultimediaExplanationStaticConfig & MultimediaExplanationConfig
): EditorPlugin<MultimediaExplanationState, MultimediaExplanationConfig> {
  return {
    Component: MultimediaExplanationEditor,
    config,
    state: createMultimediaExplanationState(config)
  }
}
