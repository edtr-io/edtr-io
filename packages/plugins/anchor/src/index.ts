import {
  EditorPlugin,
  EditorPluginProps,
  string,
  StringStateType,
} from '@edtr-io/plugin'

import { AnchorEditor } from './editor'

/**
 * @param config - {@link AnchorConfig | Plugin configuration}
 * @public
 */
export function createAnchorPlugin(
  config: AnchorConfig = {}
): EditorPlugin<AnchorPluginState, AnchorConfig> {
  return {
    Component: AnchorEditor,
    config,
    state: string(),
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
export type AnchorProps = EditorPluginProps<AnchorPluginState, AnchorConfig>
