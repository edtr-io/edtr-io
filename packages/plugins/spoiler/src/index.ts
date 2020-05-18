import {
  child,
  ChildStateType,
  ChildStateTypeConfig,
  EditorPlugin,
  EditorPluginProps,
  object,
  ObjectStateType,
  string,
  StringStateType,
} from '@edtr-io/plugin'
import { DeepPartial } from '@edtr-io/ui'
import * as R from 'ramda'

import { SpoilerEditor } from './editor'

/**
 * @param config - {@link SpoilerConfig | Plugin configuration}
 * @public
 */ export function createSpoilerPlugin(
  config: SpoilerConfig
): EditorPlugin<SpoilerPluginState, SpoilerPluginConfig> {
  const { i18n = {}, theme = {}, content } = config

  return {
    Component: SpoilerEditor,
    config: () => {
      return {
        i18n: R.mergeDeepRight(
          {
            title: {
              placeholder: 'Enter a title',
            },
          },
          i18n
        ),
        theme: {
          color: '#f5f5f5',
          ...theme,
        },
      }
    },
    state: object({
      title: string(''),
      content: child(content),
    }),
  }
}

/** @public */
export interface SpoilerConfig {
  content: ChildStateTypeConfig
  i18n?: DeepPartial<SpoilerPluginConfig['i18n']>
  theme?: Partial<SpoilerPluginConfig['theme']>
}

/** @public */
export type SpoilerPluginState = ObjectStateType<{
  title: StringStateType
  content: ChildStateType
}>

/** @public */
export interface SpoilerPluginConfig {
  i18n: {
    title: {
      placeholder: string
    }
  }
  theme: {
    color: string
  }
}

/** @public */
export type SpoilerProps = EditorPluginProps<
  SpoilerPluginState,
  SpoilerPluginConfig
>
