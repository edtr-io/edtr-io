import {
  EditorPlugin,
  EditorPluginProps,
  string,
  StringStateType
} from '@edtr-io/plugin'

import { AnchorEditor } from './editor'

/**
 * @param config - {@link AnchorConfig | Plugin configuration}
 * @public
 */
export function createAnchorPlugin(
  config: AnchorConfig = {}
): EditorPlugin<AnchorPluginState, AnchorPluginConfig> {
  const { i18n = {} } = config

  return {
    Component: AnchorEditor,
    config: {
      i18n: {
        label: 'Identifier',
        placeholder: 'ID of the anchor',
        ...i18n
      }
    },
    state: string()
  }
}

/** @public */
export interface AnchorConfig {
  i18n?: Partial<AnchorPluginConfig['i18n']>
}

/** @public */
export type AnchorPluginState = StringStateType

/** @public */
export interface AnchorPluginConfig {
  i18n: {
    label: string
    placeholder: string
  }
}

/** @public */
export type AnchorProps = EditorPluginProps<
  AnchorPluginState,
  AnchorPluginConfig
>
