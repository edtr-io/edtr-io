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
  ObjectStateType,
} from '@edtr-io/plugin'
import { DeepPartial } from '@edtr-io/ui'

import { MultimediaExplanationEditor } from './editor'

/**
 * @param config - {@link MultimediaExplanationConfig | Plugin configuration}
 * @public
 */
export function createMultimediaExplanationPlugin(
  config: MultimediaExplanationConfig
): EditorPlugin<MultimediaExplanationPluginState, MultimediaExplanationConfig> {
  const { plugins, explanation } = config

  return {
    Component: MultimediaExplanationEditor,
    config,
    state: object({
      explanation: child(explanation),
      multimedia: child({ plugin: plugins[0].name }),
      illustrating: boolean(true),
      width: number(50), // percent
    }),
  }
}

/** @public */
export interface MultimediaExplanationConfig
  extends Omit<MultimediaExplanationPluginConfig, 'features' | 'i18n'> {
  explanation: ChildStateTypeConfig
  i18n?: DeepPartial<MultimediaExplanationPluginConfig['i18n']>
  features?: {
    importance?: boolean
  }
}

/** @public */
export type MultimediaExplanationPluginState = ObjectStateType<{
  explanation: ChildStateType
  multimedia: ChildStateType
  illustrating: BooleanStateType
  width: NumberStateType
}>

/** @public */
export interface MultimediaExplanationPluginConfig {
  plugins: {
    name: string
    title: string
  }[]
  i18n: {
    changeMultimediaType: string
    reset: string
    illustrating: {
      label: string
      values: {
        illustrating: string
        explaining: string
      }
    }
  }
  features: {
    importance: boolean
  }
}

/** @public */
export type MultimediaExplanationProps = EditorPluginProps<
  MultimediaExplanationPluginState,
  MultimediaExplanationConfig
>
