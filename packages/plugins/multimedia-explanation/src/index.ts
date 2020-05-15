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
import * as R from 'ramda'

import { MultimediaExplanationEditor } from './editor'

/**
 * @param config - {@link MultimediaExplanationConfig | Plugin configuration}
 * @public
 */
export function createMultimediaExplanationPlugin(
  config: MultimediaExplanationConfig
): EditorPlugin<
  MultimediaExplanationPluginState,
  MultimediaExplanationPluginConfig
> {
  const { i18n = {}, plugins, explanation } = config

  return {
    Component: MultimediaExplanationEditor,
    config: {
      plugins,
      i18n: R.mergeDeepRight(
        {
          changeMultimediaType: 'Change the multimedia type',
          illustrating: {
            label: 'How important is the multimedia content?',
            values: {
              illustrating: 'It is an illustrating',
              explaining: 'It is essential',
            },
          },
        },
        i18n
      ),
    },
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
  extends Omit<MultimediaExplanationPluginConfig, 'i18n'> {
  explanation: ChildStateTypeConfig
  i18n?: DeepPartial<MultimediaExplanationPluginConfig['i18n']>
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
    illustrating: {
      label: string
      values: {
        illustrating: string
        explaining: string
      }
    }
  }
}

/** @public */
export type MultimediaExplanationProps = EditorPluginProps<
  MultimediaExplanationPluginState,
  MultimediaExplanationPluginConfig
>
